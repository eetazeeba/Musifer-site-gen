(function () {
  var form = document.querySelector(".contact-form");
  if (!form) return;
  var EMAIL_REGEX = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;

  var validationNote = form.querySelector("[data-contact-validation-note]");
  var requiredControls = Array.prototype.slice.call(form.querySelectorAll("[required]"));
  var emailControl = form.querySelector("#contact-email");
  var submitButton = form.querySelector('button[type="submit"]');
  var successPanel = form.parentElement.querySelector(".contact-status--success");
  var errorPanel = form.parentElement.querySelector(".contact-status--error");

  if (!requiredControls.length) return;

  /**
   * Dispatch analytics event for contact form submission
   * @param {string} action - "submit" | "success" | "error" | "throttled"
   * @param {object} props - Additional properties
   */
  function trackContactEvent(action, props) {
    // Use custom event if analytics.js exists
    try {
      if (typeof window.trackContact === "function") {
        window.trackContact(action, props || {});
      }
    } catch (e) {
      // Silently fail if analytics not available
    }
  }

  function syncEmailCustomValidity(control) {
    if (!control || control !== emailControl) return;

    var value = String(control.value || "").trim();
    if (!value) {
      control.setCustomValidity("");
      return;
    }

    if (EMAIL_REGEX.test(value)) {
      control.setCustomValidity("");
      return;
    }

    control.setCustomValidity("Enter a valid email address, for example: name@example.com");
  }

  function setInvalidState(control, isInvalid) {
    var group = control.closest(".contact-form__group");
    if (group) {
      group.classList.toggle("is-invalid", isInvalid);
    }
    control.setAttribute("aria-invalid", isInvalid ? "true" : "false");
  }

  function firstInvalidRequiredControl() {
    var firstInvalid = null;

    requiredControls.forEach(function (control) {
      syncEmailCustomValidity(control);
      var invalid = !control.checkValidity();
      setInvalidState(control, invalid);
      if (!firstInvalid && invalid) {
        firstInvalid = control;
      }
    });

    return firstInvalid;
  }

  function syncValidationNote() {
    if (!validationNote) return;
    validationNote.hidden = !firstInvalidRequiredControl();
  }

  function handleControlUpdate(control) {
    if (!form.classList.contains("is-validation-attempted")) return;

    syncEmailCustomValidity(control);
    setInvalidState(control, !control.checkValidity());
    syncValidationNote();
  }

  /**
   * Hide all status panels
   */
  function hideStatusPanels() {
    if (successPanel) successPanel.hidden = true;
    if (errorPanel) errorPanel.hidden = true;
  }

  /**
   * Show success panel and reset form
   */
  function showSuccess() {
    hideStatusPanels();
    if (successPanel) {
      successPanel.hidden = false;
      // Move focus to success panel for accessibility
      successPanel.focus();
      // If not focusable, focus the strong tag
      if (document.activeElement === document.body) {
        var strong = successPanel.querySelector("strong");
        if (strong) strong.focus();
      }
    }
    // Reset form values
    form.reset();
    form.classList.remove("is-validation-attempted");
    trackContactEvent("success");
  }

  /**
   * Show error panel with optional custom message
   * @param {string} message - Optional custom error message
   */
  function showError(message) {
    hideStatusPanels();
    if (errorPanel) {
      errorPanel.hidden = false;
      // Optionally update error message if custom message provided
      if (message) {
        var body = errorPanel.querySelector("p");
        if (body) {
          body.textContent = message;
        }
      }
      // Move focus to error panel for accessibility
      errorPanel.focus();
      if (document.activeElement === document.body) {
        var strong = errorPanel.querySelector("strong");
        if (strong) strong.focus();
      }
    }
    trackContactEvent("error");
  }

  /**
   * Submit form via async fetch
   */
  function submitFormAsync(event) {
    event.preventDefault();

    // Hide status panels and validation note
    hideStatusPanels();
    if (validationNote) {
      validationNote.hidden = true;
    }

    // Disable submit button and show loading state
    var originalText = submitButton ? submitButton.textContent : "";
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending…";
    }

    // Serialize form data
    var formData = new FormData(form);
    var payload = Object.fromEntries(formData);

    // Get endpoint from form action attribute
    var endpoint = form.getAttribute("action") || "/api/contact";

    // Submit via fetch
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        // Track submit attempt with response code
        trackContactEvent("submit", { status: response.status });

        // Handle response
        if (response.status === 200) {
          return response.json().then(function () {
            showSuccess();
          });
        } else if (response.status === 429) {
          return response.json().then(function (data) {
            showError(data.message || "Too many requests. Please try again later.");
          });
        } else {
          return response.json().then(function (data) {
            showError(data.message || "Your message couldn't be sent. Please try again.");
          });
        }
      })
      .catch(function (err) {
        console.error("Contact form submission error:", err);
        showError("An unexpected error occurred. Please try again or reach out directly.");
      })
      .finally(function () {
        // Re-enable submit button
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }
      });
  }

  form.addEventListener("submit", function (event) {
    form.classList.add("is-validation-attempted");

    var firstInvalid = firstInvalidRequiredControl();

    if (validationNote) {
      validationNote.hidden = !firstInvalid;
    }

    if (firstInvalid) {
      event.preventDefault();
      firstInvalid.focus();
      return;
    }

    // Form is valid, submit asynchronously
    submitFormAsync(event);
  });

  form.addEventListener(
    "invalid",
    function (event) {
      var control = event.target;
      if (!(control instanceof HTMLElement)) return;
      if (!control.matches("[required]")) return;

      form.classList.add("is-validation-attempted");
      setInvalidState(control, true);

      if (validationNote) {
        validationNote.hidden = false;
      }
    },
    true
  );

  requiredControls.forEach(function (control) {
    control.addEventListener("input", function () {
      syncEmailCustomValidity(control);
      handleControlUpdate(control);
    });

    control.addEventListener("blur", function () {
      syncEmailCustomValidity(control);
      handleControlUpdate(control);
    });
  });
})();
