class RegiondoCatalogWrapper extends HTMLElement {
  connectedCallback() {
    if (this.loaded) return;
    this.loaded = true;

    const widgetId =
      this.getAttribute("widget-id") ||
      "b7b0addf-ef62-4f4f-9825-9af279a2441c";

    this.style.display = "block";
    this.style.width = "100%";
    this.style.minHeight = "800px";
    this.style.overflow = "hidden";

    this.innerHTML = `
      <product-catalog-widget widget-id="${widgetId}"></product-catalog-widget>
    `;

    const script = document.createElement("script");
    script.src = "https://widgets.regiondo.net/catalog/v1/catalog-widget.min.js";
    script.type = "text/javascript";
    script.async = true;
    document.head.appendChild(script);
  }
}

if (!customElements.get("regiondo-catalog-wrapper")) {
  customElements.define("regiondo-catalog-wrapper", RegiondoCatalogWrapper);
}
