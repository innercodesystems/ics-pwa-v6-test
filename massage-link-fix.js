// ICS · Transformationsmassage Link
// Die frühere Website-Route /massagebereich existiert nicht mehr.
(() => {
  const massageLink = document.querySelector('a[href="https://innercodesystems.com/massagebereich"]');
  if (!massageLink) return;

  massageLink.href = 'https://innercodesystems.github.io/ics-auswertungstool/transformationsmassage.html';
})();
