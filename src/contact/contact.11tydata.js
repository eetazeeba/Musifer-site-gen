const schema = require("../_data/schema");

const sectionData = schema.createSectionPageData({
  sectionTitle: "Contact",
  sectionUrl: "/contact/"
});

module.exports = {
  ...sectionData,
  form: {
    title: "Send us a message",
    intro: "Have a project, question, or idea? Fill out the form below and we\u2019ll get back to you.",
    responseNote: "We typically respond within 2\u20133 business days.",
    endpoint: "",
    fields: {
      name: {
        label: "Your name",
        autocomplete: "name"
      },
      email: {
        label: "Email address",
        autocomplete: "email",
        pattern: "^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\\.[A-Za-z0-9-]+)+$",
        title: "Enter a valid email address, for example: name@example.com"
      },
      subject: {
        label: "Subject (optional)",
        autocomplete: "off"
      },
      message: {
        label: "Message",
        placeholder: "Tell us about your project or question."
      }
    },
    submit: {
      label: "Send message"
    },
    success: {
      heading: "Message received",
      body: "Thanks for reaching out. We\u2019ll be in touch within a few business days."
    },
    error: {
      heading: "Something went wrong",
      body: "Your message couldn\u2019t be sent. Please try again, or reach out directly."
    }
  }
};