// Photos libres de droits (licence Unsplash : usage commercial gratuit, sans attribution obligatoire).
// Source de chaque photo : https://unsplash.com/photos/<slug>
export const PHOTOS = {
  studentWoman: { id: "1604933762021-54a5858c9832", alt: "Étudiante souriante travaillant sur son ordinateur portable", slug: "woman-using-laptop-in-workspace-HA-0i0E7sq4" },
  smilingMan:   { id: "1620829813573-7c9e1877706f", alt: "Homme souriant devant son ordinateur portable", slug: "man-in-gray-crew-neck-t-shirt-using-laptop-computer-KUzlAah2dog" },
  benchWoman:   { id: "1765650114706-6f71e3cc904a", alt: "Femme souriante utilisant un ordinateur portable", slug: "woman-typing-on-laptop-at-workspace-RMK8Lt3Ac2s" },
  deskMan:      { id: "1594077810908-9ffd89d704ac", alt: "Homme travaillant sur un ordinateur portable à son bureau", slug: "man-in-white-and-red-crew-neck-t-shirt-using-laptop-computer-e8etaVo85AY" },
  thinkingMan:  { id: "1630509866946-f5766223f953", alt: "Homme réfléchissant dans une rue commerçante", slug: "" },
  phoneWoman:   { id: "1675167850273-1301ef017798", alt: "Femme souriante consultant un message sur son téléphone", slug: "" },
  shopkeeper:   { id: "1687422808311-a776f467a468", alt: "Commerçant souriant dans sa boutique", slug: "" },
  outdoorWoman: { id: "1655720348616-184ae7fad7e3", alt: "Femme travaillant sur son ordinateur portable en extérieur", slug: "a-person-sitting-on-a-bench-with-a-laptop-SESt1VL2D-w" },
  proudMan:     { id: "1684337399050-0412ebed8005", alt: "Homme souriant tenant son ordinateur portable", slug: "" },
} as const;

export type PhotoKey = keyof typeof PHOTOS;

export function unsplash(id: string, w: number, h: number) {
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&crop=faces,center&auto=format&q=75`;
}
