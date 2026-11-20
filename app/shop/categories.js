export const categories = [
  { name: "Hunde mad", links: ["Tørfoder", "Vådfoder", "Godbidder"] },
  { name: "Hvalp", links: ["Hvalpefoder", "Hvalpe pleje", "hvalpe udstyr"] },
  { name: "Hjemmet", links: ["Hundesenge", "Hundeskåle", "Rengøring"] },
  { name: "pleje", links: ["Pelspleje", "Tandpleje", "Mave & tarme"] },
  { name: "Loppe- & flåtmidler", links: ["Kamme", "Kræm"] },
  { name: "Udendørs", links: ["Halsbånd", "Snore", "Seler", "Mundkurve", "Poser", "Regntøj"] },
  { name: "Legetøj", links: ["Bamser", "Kaste", "Tyggeben"] },
  { name: "Transport & Sikkerhed", links: ["hundetasker", "Låger & gitter", "Transportkasser & -bure"] },
  { name: "Hundetøj", links: ["Regntøj", "Trøjer", "Jakker"] },
  { name: "Træning", links: ["Agilityudstyr", "Fløjter", "godbidtasker", "Træningsgodbidder"] },
];

export function categorySlug(name) {
  return name
    .toLowerCase()
    .replaceAll("ø", "o")
    .replaceAll("æ", "ae")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const categoryNames = [...new Set(categories.flatMap((category) => category.links))];
