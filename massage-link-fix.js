// ICS · Website Links
// Frühere Website-Routen existieren nach der HTML-Umstellung nicht mehr.
(() => {
  const massageLink = document.querySelector('a[href="https://innercodesystems.com/massagebereich"]');
  if (massageLink) {
    massageLink.href = 'https://innercodesystems.github.io/ics-auswertungstool/transformationsmassage.html';
  }

  const akademieLinks = document.querySelectorAll(
    'a[href="https://innercodesystems.com/ics-akademie"], a[href="https://www.innercodesystems.com/ics-akademie"], a[href="https://n1594499.websitebuilder.online/ics-akademie"]'
  );

  akademieLinks.forEach((link) => {
    link.href = 'https://innercodesystems.github.io/ics-auswertungstool/ics-akademie.html';
  });
})();
