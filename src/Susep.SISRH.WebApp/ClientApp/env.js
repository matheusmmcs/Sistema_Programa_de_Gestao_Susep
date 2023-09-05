(function (window) {
  window.__env = window.__env || {};
  window.__env.production = true,
  window.__env.identityUrl = "/gateway/",
  window.__env.apiGatewayUrl = "/gateway/",
  window.__env.modo = "normal", // "avancado",
  window.__env.appTitle = 'SISPG :: UFPI - 1.8',
  window.__env.client = {
      id: "SISGP.Web",
      secret: 'secret',
      scope: "SISGP.ProgramaGestao"
  },
  window.__env.valorPadraoTempoComparecimento = 2,
  window.__env.valorPadraoTermosUso = "Declaro que estou ciente e de acordo com os termos de adesão e de ciência e responsabilidade conforme a Resolução CAD/UFPI n.º 88/2022.",
  window.__env.formaParticipacaoPlanoTrabalho = 'SomenteSelecionados'
}(this));