class RegiondoCatalogWrapper extends HTMLElement {
  connectedCallback() {
    if (this.initialized) return;
    this.initialized = true;

    const widgetId =
      this.getAttribute("widget-id") ||
      "b7b0addf-ef62-4f4f-9825-9af279a2441c";

    this.style.display = "block";
    this.style.width = "100%";
    this.style.height = "1000px";
    this.style.minHeight = "1000px";
    this.style.overflow = "hidden";

    this.innerHTML = `
      <style>
        html,
        body {
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
        }

        :host {
          display: block;
          width: 100%;
          height: 1000px;
          overflow: hidden !important;
        }

        product-catalog-widget {
          display: block;
          width: 100%;
          min-height: 1000px;
          overflow: hidden !important;
        }
      </style>

      <product-catalog-widget widget-id="${widgetId}"></product-catalog-widget>
    `;

    this.loadRegiondoScript();
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
}

if (!customElements.get("regiondo-catalog-wrapper")) {
  customElements.define("regiondo-catalog-wrapper", RegiondoCatalogWrapper);
}
