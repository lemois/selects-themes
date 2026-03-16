(() => {
  function setupDetailGallery(root) {
    const gallery = root.querySelector("[data-detail-gallery]");
    const preview = root.querySelector("[data-detail-gallery-preview]");
    const previewImage = preview?.querySelector("img");
    const hasTiles = gallery?.querySelector("[data-detail-image]");
    if (!gallery || !preview || !previewImage || gallery.dataset.bound === "true") {
      return;
    }

    if (!hasTiles) return;

    gallery.dataset.bound = "true";

    const isMobile = () => window.innerWidth <= 767;

    const setPreview = (src) => {
      if (!src) return;
      preview.hidden = false;
      previewImage.src = src;
    };

    const resetPreview = () => {
      if (isMobile()) {
        preview.hidden = true;
        previewImage.removeAttribute("src");
        return;
      }

      const primaryPreviewPath =
        gallery
          .querySelector("[data-detail-image]")
          ?.getAttribute("data-preview-image") || "";
      if (!primaryPreviewPath) return;
      setPreview(primaryPreviewPath);
    };

    resetPreview();

    gallery.addEventListener("mouseover", (event) => {
      const tile = event.target.closest("[data-detail-image]");
      if (!tile || isMobile()) return;
      const previewPath = tile.getAttribute("data-preview-image");
      const isPrimary = tile.getAttribute("data-primary-image") === "true";
      if (!previewPath || isPrimary) return;
      setPreview(previewPath);
    });

    gallery.addEventListener("mouseout", (event) => {
      const tile = event.target.closest("[data-detail-image]");
      if (!tile || isMobile()) return;
      resetPreview();
    });

    gallery.addEventListener("click", (event) => {
      if (!isMobile()) return;
      const tiles = gallery.querySelectorAll("[data-detail-image]");
      if (tiles.length <= 1) return;

      const clickX = event.clientX;
      const imageFullWidth = 310;
      const currentImageIndex = Math.round(
        gallery.scrollLeft / imageFullWidth,
      );
      const targetIndex =
        clickX < gallery.clientWidth / 2
          ? Math.max(0, currentImageIndex - 1)
          : Math.min(tiles.length - 1, currentImageIndex + 1);

      gallery.scrollTo({
        left: targetIndex * imageFullWidth,
        behavior: "smooth",
      });
    });

    window.addEventListener("resize", resetPreview);
  }

  window.selectsInit = (root) => {
    setupDetailGallery(root);
  };

  window.Alpine.start();
})();
