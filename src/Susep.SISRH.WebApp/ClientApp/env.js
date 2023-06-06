(function (window) {
  window.__env = window.__env || {};
window.__env.production = false,
  window.__env.identityUrl = "https://sispghomolog.ufpi.br:8081/",
  window.__env.apiGatewayUrl = "https://sispghomolog.ufpi.br:8081/",
window.__env.appTitle = 'SISPG :: UFPI',
  window.__env.modo = "normal", // "avancado",
  window.__env.client = {
      id: "SISGP.Web",
      secret: 'secret',
      scope: "SISGP.ProgramaGestao"
  }
}(this));
