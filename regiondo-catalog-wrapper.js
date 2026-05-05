class RegiondoCatalogWrapper extends HTMLElement {
  connectedCallback() {
    if (this.initialized) return;
    this.initialized = true;

    this.widgetId =
      this.getAttribute("widget-id") ||
      "b7b0addf-ef62-4f4f-9825-9af279a2441c";

    this.style.display = "block";
    this.style.width = "100%";
    this.style.minHeight = "300px";
    this.style.overflow = "hidden";

    this.innerHTML = `
      <div id="regiondo-wrapper" style="width:100%; overflow:hidden;">
        <product-catalog-widget widget-id="${this.widgetId}"></product-catalog-widget>
      </div>
    `;

    this.loadRegiondoScript();
    this.startAutoResize();
  }

  loadRegiondoScript() {
    const existingScript = document.querySelector(
      'script[src="https://widgets.regiondo.net/catalog/v1/catalog-widget.min.js"]'
    );

    if (existingScript) return;

    const script = document.createElement("script");
    script.src = "https://widgets.regiondo.net/catalog/v1/catalog-widget.min.js";
    script.type = "text/javascript";
    script.async = true;
    document.head.appendChild(script);
  }

  startAutoResize() {
    const wrapper = this.querySelector("#regiondo-wrapper");
    const widget = this.querySelector("product-catalog-widget");

    const resize = () => {
      let newHeight = 300;

      const shadowRoot = widget?.shadowRoot;

      if (shadowRoot) {
        const possibleContent = shadowRoot.querySelector(
          ".regiondo-booking, .regiondo-catalog, .regiondo-widget, main, form"
        );

        if (possibleContent) {
          newHeight = possibleContent.scrollHeight;
        } else {
          newHeight = shadowRoot.host.scrollHeight;
        }
      } else {
        newHeight = wrapper.scrollHeight;
      }

      newHeight = Math.max(newHeight, 300);

      this.style.height = `${newHeight}px`;
      wrapper.style.height = `${newHeight}px`;

      if (window.parent && window.parent !== window) {
        window.parent.postMessage(
          {
            type: "regiondo-widget-resize",
            height: newHeight,
          },
          "*"
        );
      }
    };

    const observer = new MutationObserver(() => {
      setTimeout(resize, 100);
      setTimeout(resize, 500);
      setTimeout(resize, 1000);
    });

    observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    const resizeObserver = new ResizeObserver(() => {
      setTimeout(resize, 100);
    });

    resizeObserver.observe(wrapper);

    setInterval(resize, 700);

    setTimeout(resize, 500);
    setTimeout(resize, 1500);
    setTimeout(resize, 3000);
  }
}

customElements.define("regiondo-catalog-wrapper", RegiondoCatalogWrapper);
