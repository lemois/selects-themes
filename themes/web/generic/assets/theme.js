(() => {
  const DEFAULT_SECTIONS = ["image", "text", "indicator", "items"];

  function normalizeSections(value) {
    return Array.isArray(value)
      ? value.filter((section) => DEFAULT_SECTIONS.includes(section))
      : DEFAULT_SECTIONS;
  }

  function normalizeColumns(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 4;
    return Math.min(4, Math.max(1, Math.round(number)));
  }

  function injectStyles(params) {
    if (typeof params.styles !== "string" || params.styles.length === 0) return;

    const style = document.createElement("style");
    style.setAttribute("data-generic-theme-styles", "");
    style.textContent = params.styles;
    document.head.appendChild(style);
  }

  function applyTopSectionsOrder(root, params) {
    const container = root.querySelector("[data-sections-container]");
    if (!container) return;

    const orderedSections = normalizeSections(params.sections);

    orderedSections.forEach((sectionName) => {
      const section = container.querySelector(
        `[data-top-section="${sectionName}"]`,
      );
      if (section) container.appendChild(section);
    });
  }

  function applyCatalogColumns(root, params) {
    const columns = normalizeColumns(params.columns);
    root.querySelectorAll("[data-catalog-grid]").forEach((element) => {
      element.classList.remove(
        "columns-1",
        "columns-2",
        "columns-3",
        "columns-4",
      );
      element.classList.add(`columns-${columns}`);
    });
  }

  function setupToTop(root) {
    const button = root.querySelector("[data-to-top-button]");
    if (!button || button.dataset.bound === "true") return;

    button.dataset.bound = "true";

    const updateVisibility = () => {
      button.classList.toggle("is-hidden", window.scrollY < 100);
    };

    button.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
  }

  function setupCategoryNavigation(root, params) {
    const nav = root.querySelector("[data-category-nav]");
    const navScroll = root.querySelector("[data-category-nav-scroll]");
    const leftShadow = root.querySelector("[data-nav-shadow-left]");
    const rightShadow = root.querySelector("[data-nav-shadow-right]");
    if (!nav || !navScroll || !leftShadow || !rightShadow) return;

    const sectionElements = Array.from(
      root.querySelectorAll("[data-category-section]"),
    );
    const sectionNames = sectionElements
      .map((element) => element.getAttribute("data-section-name") || "")
      .filter(Boolean);

    nav.hidden = !(params.categoryNavigation && sectionNames.length > 0);
    if (nav.hidden || nav.dataset.bound === "true") return;

    nav.dataset.bound = "true";
    navScroll.innerHTML = "";

    sectionNames.forEach((sectionName, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "category-nav__item";
      button.textContent = sectionName;
      button.dataset.section = `category-section-${index + 1}`;
      button.addEventListener("click", () => {
        document.getElementById(button.dataset.section)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
      navScroll.appendChild(button);
    });

    const buttons = Array.from(
      navScroll.querySelectorAll(".category-nav__item"),
    );

    const updateShadows = () => {
      leftShadow.hidden = navScroll.scrollLeft <= 0;
      rightShadow.hidden =
        navScroll.scrollLeft >=
        navScroll.scrollWidth - navScroll.clientWidth - 1;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length === 0) return;

        const activeId = visible[0].target.id;
        buttons.forEach((button) => {
          button.classList.toggle(
            "is-active",
            button.dataset.section === activeId,
          );
        });

        const activeButton = buttons.find(
          (button) => button.dataset.section === activeId,
        );
        if (!activeButton) return;

        const shadowWidth = 40;
        const itemRect = activeButton.getBoundingClientRect();
        const navRect = navScroll.getBoundingClientRect();
        const visibleLeft = navRect.left + shadowWidth;
        const visibleRight = navRect.right - shadowWidth;

        if (itemRect.left < visibleLeft || itemRect.right > visibleRight) {
          const targetLeft =
            activeButton.offsetLeft +
            activeButton.offsetWidth / 2 -
            navScroll.clientWidth / 2;
          navScroll.scrollTo({ left: targetLeft, behavior: "smooth" });
        }
      },
      {
        rootMargin: "-100px 0px -45% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    );

    sectionElements.forEach((element, index) => {
      element.id = `category-section-${index + 1}`;
      observer.observe(element);
    });

    navScroll.addEventListener("scroll", updateShadows, { passive: true });
    window.addEventListener("resize", updateShadows);
    updateShadows();
  }

  window.selectsInit = (root, params) => {
    injectStyles(params);
    applyTopSectionsOrder(root, params);
    setupToTop(root);
  };

  window.selectsInitItems = (root, params) => {
    applyCatalogColumns(root, params);
    setupCategoryNavigation(root, params);
  };

  window.Alpine.start();
})();
