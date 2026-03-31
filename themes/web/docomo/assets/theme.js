(() => {
  const BREAKPOINT = 768;

  const letterContents = [
    "首都圏ブロック3周年おめでとうございます。\n私は、2025年6月に着任なので、かかわらせていただいた期間は短期間ですが、皆さんのおかげで、毎日楽しく仕事ができております。そして、首都圏ブロックに在籍していることのありがたみを毎日実感しております。ありがとうございます。\nうちの会社はなんだか組織見直しが好きな会社ですね。私、個人の意見としては、こんなに組織を見直さなくてもいいのでは？と思うことがあります。そのような中で、大きな組織を0から立ち上げることの大変さ！立ち上げから今まで、携わっていただいたすべての、皆さまに感謝いたします。おかげ様でとても素敵な支社になりました。\n今後についても、皆さんが楽しく仕事ができた上で、会社の業績があがるような支社を目指していきます。\n引き続きたくさんのコミュニケーションを取っていきたいと思いますのでよろしくお願いします。",

    '<span style="font-weight:600">Congrats 3rd Anniversary!</span><br>「３」は、僕が何かに向き合うときに数えるマジックナンバーです。<br>３日坊主、３週の習慣化、３ヶ月の法則、そして３年はひとつの時代。<br>着任直後に発足した首都圏ブロックは、何もないところから始まりました。新しい仲間と、知らない場所で、なれないことに挑み、皆がもがいていた日々。<br><span style="text-decoration:underline">#２年目のチャレンジ</span>では、リソース不足ながら少数精鋭で運営が軌道に乗り、僕が去る頃には、皆が自分の足で歩けるようになっていました。その姿を誇らしく思います。<br>首都圏での日々は、僕のドコモ最終章であり、プロフェッショナル人生のクライマックスでした。あちこちの現場に皆と出かけて行った日々は、いまも大切な思い出です。関わってくれた皆さん、本当にありがとう！<br>そして、僕たち首都圏は、いつまでもUp-Carrier。いまを超え続けていきましょう。',

    "この度はドコモ首都圏ブロック設立3周年、おめでとうございます。変化が大変激しい時期でしたので、３年といってもあっという間だったのではないでしょうか。\n首都圏支社設立直前に東京支店に在籍していた当時、オフィスを拡大することなく、いくつかの会議室を改造して首都圏支社を作り、同じフロアの反対側へ設立前夜に台車に荷物を乗せて運んだことをよく覚えています。\n中央エリアへの支社新設、本社機能、権限の一定程度を支社へ移管ということで周囲からの期待も大きく、我々もその過程を楽しんでいましたね。設立後も思い切った施策を皆でいくつもやりましたし、今思い返しても当時のメンバーとやった仕事は印象深いです。ただ、残念ながら首都圏支社には1年しかいられず、飯田橋ライフがあまりに短かったことが唯一の心残りです。3年経った現在でも理由をつけて飯田橋で飲んでいますので、機会があればぜひお声がけください。",
  ];

  const readStatus = [false, false, false];

  function isMobile() {
    return window.matchMedia(`(max-width: ${BREAKPOINT - 1}px)`).matches;
  }

  // ===== SP: Scroll Snap Control =====

  function setupScrollSnap(root) {
    const lastPage = root.querySelector('[data-card-page="last"]');
    if (!lastPage) return;

    let isReady = false;
    let isNearEnd = false;

    function updateSnap() {
      const shouldSnap = isReady && !isNearEnd;
      document.documentElement.style.scrollSnapType = shouldSnap
        ? "y mandatory"
        : "";

      const pages = root.querySelectorAll("[data-card-page]");
      const kv = root.querySelector(".kv-sp");
      const snappables = kv ? [kv, ...pages] : [...pages];

      snappables.forEach((el) => {
        if (shouldSnap) {
          el.style.scrollSnapAlign = "start";
          el.style.scrollSnapStop = "always";
        } else {
          el.style.scrollSnapAlign = "";
          el.style.scrollSnapStop = "";
        }
      });
    }

    function handleScroll() {
      const rect = lastPage.getBoundingClientRect();
      const wasNearEnd = isNearEnd;
      isNearEnd = rect.top <= 0;
      if (wasNearEnd !== isNearEnd) updateSnap();
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    requestAnimationFrame(() => {
      isReady = true;
      updateSnap();
    });
  }

  // ===== SP: Card Width Calculation =====

  function setupSpCardWidths(root) {
    const cards = root.querySelectorAll(".card-sp");
    if (cards.length === 0) return;

    function update() {
      const maxWidth = (window.innerHeight - 200) / 1.25;
      cards.forEach((card) => {
        card.style.maxWidth = maxWidth + "px";
      });
    }

    update();
    window.addEventListener("resize", update);
  }

  // ===== SP: Letter Animation via IntersectionObserver =====

  function setupSpLetterAnimations(root) {
    const cards = root.querySelectorAll(".card-sp[data-card-index]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const letter = entry.target.querySelector("[data-letter]");
          if (letter && !letter.classList.contains("is-animating")) {
            letter.classList.add("is-animating");
          }
        });
      },
      { threshold: 0.5 },
    );

    cards.forEach((card) => observer.observe(card));
  }

  // ===== SP: Modal =====

  function openSpModal(index) {
    const scrollY = window.scrollY;

    // Lock body scroll
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "sp-modal-overlay";

    // Create modal
    const modal = document.createElement("div");
    modal.className = "sp-modal";

    const close = document.createElement("div");
    close.className = "sp-modal__close";

    const body = document.createElement("div");
    body.className = "sp-modal__body";

    const text = document.createElement("div");
    text.className = "sp-modal__text";

    const content = letterContents[index];
    if (content.includes("<")) {
      text.innerHTML = content;
    } else {
      text.style.whiteSpace = "pre-line";
      text.textContent = content;
    }

    body.appendChild(text);
    modal.appendChild(close);
    modal.appendChild(body);

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    // Mark as read
    markAsRead(index);

    function closeModal() {
      document.body.removeChild(overlay);
      document.body.removeChild(modal);

      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    }

    close.addEventListener("click", closeModal);
  }

  function setupSpCards(root) {
    const cards = root.querySelectorAll(".card-sp[data-card-index]");
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        const index = parseInt(card.dataset.cardIndex, 10);
        openSpModal(index);
      });
    });
  }

  // ===== PC: Modal =====

  function setupPcCards(root) {
    const modalEl = root.querySelector("[data-pc-modal]");
    if (!modalEl) return;

    const modalText = modalEl.querySelector("[data-modal-text]");
    const modalClose = modalEl.querySelector("[data-modal-close]");
    const modalContent = modalEl.querySelector("[data-modal-content]");

    const cards = root.querySelectorAll(".card-pc[data-card-index]");

    function openModal(index) {
      const content = letterContents[index];
      if (content.includes("<")) {
        modalText.innerHTML = content;
      } else {
        modalText.style.whiteSpace = "pre-line";
        modalText.textContent = content;
      }

      modalEl.hidden = false;
      markAsRead(index);
    }

    function closeModal() {
      modalEl.hidden = true;
    }

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        const index = parseInt(card.dataset.cardIndex, 10);
        openModal(index);
      });
    });

    modalClose.addEventListener("click", closeModal);

    // Click-away: close when clicking overlay but not content
    modalEl.querySelector(".pc-modal__overlay").addEventListener("click", (e) => {
      if (e.target === modalEl.querySelector(".pc-modal__overlay") || e.target === modalClose) {
        closeModal();
      }
    });
  }

  // ===== Read Status =====

  function markAsRead(index) {
    if (readStatus[index]) return;
    readStatus[index] = true;

    // Hide letter text for read cards
    document.querySelectorAll(`[data-card-index="${index}"] [data-letter-text]`).forEach((el) => {
      el.classList.add("is-read");
    });

    // Show scroll indicator for SP read cards
    const cardPages = document.querySelectorAll("[data-card-page]");
    if (cardPages[index]) {
      const indicator = cardPages[index].querySelector("[data-scroll-indicator]");
      if (indicator) indicator.hidden = false;
    }
  }

  // ===== To Top =====

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

  // ===== Category Navigation =====

  function setupCategoryNavigation(root) {
    const nav = root.querySelector("[data-category-nav]");
    const navScroll = root.querySelector("[data-category-nav-scroll]");
    const leftShadow = root.querySelector("[data-nav-shadow-left]");
    const rightShadow = root.querySelector("[data-nav-shadow-right]");
    if (!nav || !navScroll || !leftShadow || !rightShadow) return;

    const sectionElements = Array.from(
      root.querySelectorAll("[data-category-section]"),
    );
    const sectionNames = sectionElements
      .map((el) => el.getAttribute("data-section-name") || "")
      .filter(Boolean);

    nav.hidden = sectionNames.length === 0;
    if (nav.hidden || nav.dataset.bound === "true") return;

    nav.dataset.bound = "true";
    navScroll.innerHTML = "";

    sectionNames.forEach((name, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "category-nav__item";
      button.textContent = name;
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

    sectionElements.forEach((el, index) => {
      el.id = `category-section-${index + 1}`;
      observer.observe(el);
    });

    navScroll.addEventListener("scroll", updateShadows, { passive: true });
    window.addEventListener("resize", updateShadows);
    updateShadows();
  }

  // ===== Init =====

  window.selectsInit = (root, params) => {
    setupToTop(root);

    if (isMobile()) {
      setupScrollSnap(root);
      setupSpCardWidths(root);
      setupSpLetterAnimations(root);
      setupSpCards(root);
    } else {
      setupPcCards(root);
    }
  };

  window.selectsInitItems = (root, params) => {
    setupCategoryNavigation(root);
  };

  window.Alpine.start();
})();
