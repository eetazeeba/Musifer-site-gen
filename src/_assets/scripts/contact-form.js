(function () {
  var form = document.querySelector(".contact-form");
  if (!form) return;
  var EMAIL_REGEX = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;

  var validationNote = form.querySelector("[data-contact-validation-note]");
  var requiredControls = Array.prototype.slice.call(form.querySelectorAll("[required]"));
  var emailControl = form.querySelector("#contact-email");

  if (!requiredControls.length) return;

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

  form.addEventListener("submit", function (event) {
    form.classList.add("is-validation-attempted");

    var firstInvalid = firstInvalidRequiredControl();

    if (validationNote) {
      validationNote.hidden = !firstInvalid;
    }

    if (firstInvalid) {
      event.preventDefault();
      firstInvalid.focus();
    }
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
