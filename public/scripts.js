(function () {
  "use strict";
  const reservedTargets = ["_self", "_blank", "_parent", "_top"],
    getTargetElement = (targetName) =>
      targetName && !reservedTargets.includes(targetName)
        ? document.getElementById(targetName)
        : null,
    sendRequest = ({ method, url, body, targetElement }) => {
      const options = { method };
      if (body) options.body = body;
      fetch(url, options)
        .then((response) => {
          if (!response.ok) throw new Error("Network error");
          return response.text();
        })
        .then((responseText) => {
          if (targetElement) targetElement.innerHTML = responseText;
        })
        .catch((error) => console.error("EnhancedHTML error:", error));
    },
    onFormSubmit = (event) => {
      const form = event.target,
        method = (form.getAttribute("method") || "GET").toUpperCase(),
        url = form.getAttribute("action") || location.href,
        targetAttr = form.getAttribute("target"),
        targetElement = getTargetElement(targetAttr);

      if (
        (method !== "GET" && method !== "POST") ||
        (targetAttr && targetElement)
      ) {
        event.preventDefault();
        const formData = new FormData(form);

        if (method === "GET") {
          const query = new URLSearchParams(formData).toString(),
            fullUrl = url + (url.indexOf("?") === -1 ? "?" : "&") + query;

          sendRequest({ method, url: fullUrl, targetElement });
        } else {
          sendRequest({ method, url, body: formData, targetElement });
        }
      }
    },
    onClick = (event) => {
      let element = event.target;
      while (
        element &&
        !(
          element instanceof HTMLAnchorElement ||
          element instanceof HTMLButtonElement
        )
      ) {
        element = element.parentElement;
      }

      if (!element) return;

      if (
        element instanceof HTMLAnchorElement &&
        element.hasAttribute("method")
      ) {
        event.preventDefault();
        const method = element.getAttribute("method").toUpperCase(),
          url = element.getAttribute("href"),
          targetElement = getTargetElement(element.getAttribute("target"));

        sendRequest({ method, url, targetElement });
        return;
      }

      if (
        element instanceof HTMLButtonElement &&
        element.hasAttribute("action")
      ) {
        event.preventDefault();
        const method = (element.getAttribute("method") || "GET").toUpperCase(),
          url = element.getAttribute("action"),
          targetElement = getTargetElement(element.getAttribute("target"));

        sendRequest({ method, url, targetElement });
      }
    };

  document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("submit", onFormSubmit, false);
    document.addEventListener("click", onClick, false);
  });
})();
