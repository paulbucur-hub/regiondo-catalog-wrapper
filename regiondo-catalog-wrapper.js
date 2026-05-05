class RegiondoCatalogWrapper extends HTMLElement {
  connectedCallback() {
    if (this.initialized) return;
    this.initialized = true;

    this.style.display = "block";
    this.style.width = "100%";
    this.style.overflow = "hidden";
    this.style.minHeight = "300px";

    const widgetId =
      this.getAttribute("widget-id") || "b7b0addf-ef62-4f4f-9825-9af279a2441c";

    this.innerHTML = `
      <product-catalog-widget widget-id="${widgetId}"></product-catalog-widget>
    `;

    this.loadRegiondoScript();
    this.startHeightWatcher();
  }

  loadRegiondoScript() {
    if (document.querySelector('script[src="https://widgets.regiondo.net/catalog/v1/catalog-widget.min.js"]')) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://widgets.regiondo.net/catalog/v1/catalog-widget.min.js";
    script.type = "text/javascript";
    document.head.appendChild(script);
  }

  startHeightWatcher() {
    const widget = this.querySelector("product-catalog-widget");

    const updateHeight = () => {
      let height = widget.scrollHeight || widget.offsetHeight || 0;

      if (widget.shadowRoot) {
        const children = Array.from(widget.shadowRoot.children);

        const shadowHeight = children.reduce((max, el) => {
          const rect = el.getBoundingClientRect();
          return Math.max(max, rect.height, el.scrollHeight || 0);
        }, 0);

        height = Math.max(height, shadowHeight);
      }

      if (height > 0) {
        const finalHeight = Math.ceil(height + 20);
        this.style.height = `${finalHeight}px`;
        this.style.minHeight = `${finalHeight}px`;
      }
    };

    const observer = new ResizeObserver(updateHeight);
    observer.observe(this);
    observer.observe(widget);

    const interval = setInterval(updateHeight, 300);

    setTimeout(() => clearInterval(interval), 20000);

    document.addEventListener("click", () => {
      setTimeout(updateHeight, 300);
      setTimeout(updateHeight, 1000);
      setTimeout(updateHeight, 2000);
    });

    window.addEventListener("resize", updateHeight);

    updateHeight();
  }
}

customElements.define("regiondo-catalog-wrapper", RegiondoCatalogWrapper);
