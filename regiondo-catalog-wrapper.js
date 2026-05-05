class RegiondoCatalogWrapper extends HTMLElement {
  connectedCallback() {
    if (this.initialized) return;
    this.initialized = true;

    const widgetId =
      this.getAttribute("widget-id") ||
      "b7b0addf-ef62-4f4f-9825-9af279a2441c";

    this.style.display = "block";
    this.style.width = "100%";
    this.style.minHeight = "300px";
    this.style.overflow = "hidden";

    this.innerHTML = `
      <product-catalog-widget widget-id="${widgetId}"></product-catalog-widget>
    `;

    this.loadRegiondoScript();
    this.startHeightWatcher();
  }

  loadRegiondoScript() {
    const src = "https://widgets.regiondo.net/catalog/v1/catalog-widget.min.js";

    if (document.querySelector(`script[src="${src}"]`)) return;

    const script = document.createElement("script");
    script.src = src;
    script.type = "text/javascript";
    script.async = true;
    document.head.appendChild(script);
  }

  startHeightWatcher() {
    const updateHeight = () => {
      const widget = this.querySelector("product-catalog-widget");

      let height = 300;

      if (widget) {
        height = Math.max(
          widget.scrollHeight,
          widget.offsetHeight,
          this.scrollHeight,
          300
        );
      }

      this.style.height = `${height}px`;
    };

    const observer = new MutationObserver(() => {
      setTimeout(updateHeight, 100);
      setTimeout(updateHeight, 500);
      setTimeout(updateHeight, 1000);
    });

    observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    setInterval(updateHeight, 1000);

    setTimeout(updateHeight, 500);
    setTimeout(updateHeight, 1500);
    setTimeout(updateHeight, 3000);
  }
}

if (!customElements.get("regiondo-catalog-wrapper")) {
  customElements.define("regiondo-catalog-wrapper", RegiondoCatalogWrapper);
}
