class RegiondoCatalogWrapper extends HTMLElement {
  connectedCallback() {
    if (this.initialized) return;
    this.initialized = true;

    const widgetId =
      this.getAttribute("widget-id") ||
      "b7b0addf-ef62-4f4f-9825-9af279a2441c";

    this.style.display = "block";
    this.style.width = "100%";
    this.style.overflow = "hidden";
    this.style.minHeight = "300px";

    this.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          overflow: hidden !important;
        }

        #regiondo-wrapper {
          width: 100%;
          overflow: hidden !important;
        }

        product-catalog-widget {
          display: block;
          width: 100%;
          overflow: hidden !important;
        }
      </style>

      <div id="regiondo-wrapper">
        <product-catalog-widget widget-id="${widgetId}"></product-catalog-widget>
      </div>
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
    const wrapper = this.querySelector("#regiondo-wrapper");
    const widget = this.querySelector("product-catalog-widget");

    const getRealHeight = () => {
      const candidates = [];

      candidates.push(wrapper);
      candidates.push(widget);

      if (widget && widget.shadowRoot) {
        widget.shadowRoot.querySelectorAll("*").forEach((el) => {
          const rect = el.getBoundingClientRect();

          if (rect.height > 50 && rect.height < 3000) {
            candidates.push(el);
          }
        });
      }

      let bestHeight = 300;

      candidates.forEach((el) => {
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);

        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          rect.height <= 0
        ) {
          return;
        }

        const h = Math.ceil(
          Math.max(el.scrollHeight || 0, el.offsetHeight || 0, rect.height || 0)
        );

        if (h > bestHeight && h < 3000) {
          bestHeight = h;
        }
      });

      return Math.max(bestHeight + 20, 300);
    };

    const applyHeight = () => {
      const height = getRealHeight();

      this.style.height = `${height}px`;
      this.style.maxHeight = `${height}px`;
      wrapper.style.height = `${height}px`;
      wrapper.style.maxHeight = `${height}px`;

      this.dispatchEvent(
        new CustomEvent("regiondoResize", {
          bubbles: true,
          composed: true,
          detail: { height },
        })
      );

      window.parent?.postMessage(
        {
          type: "regiondoResize",
          height,
        },
        "*"
      );
    };

    const runResize = () => {
      setTimeout(applyHeight, 50);
      setTimeout(applyHeight, 250);
      setTimeout(applyHeight, 700);
      setTimeout(applyHeight, 1500);
    };

    const mutationObserver = new MutationObserver(runResize);

    mutationObserver.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    const resizeObserver = new ResizeObserver(runResize);
    resizeObserver.observe(this);
    resizeObserver.observe(wrapper);
    resizeObserver.observe(widget);

    document.addEventListener("click", runResize, true);
    window.addEventListener("resize", runResize);

    setInterval(applyHeight, 1000);

    runResize();
  }
}

if (!customElements.get("regiondo-catalog-wrapper")) {
  customElements.define("regiondo-catalog-wrapper", RegiondoCatalogWrapper);
}
