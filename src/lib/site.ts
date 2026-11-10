export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
  brand: 'Oksana Matsura',
  phone: '+48 575 552 003',
  tel: '+48575552003',
  street: 'ul. Władysława Broniewskiego 14',
  city: 'Łódź',
  /** The client's Google Maps link to the office. */
  maps: 'https://maps.app.goo.gl/Q4f7zRZi32cRGqtC9',
  instagram: 'https://www.instagram.com/oksana.matsura.kredyty/' as string | null,
  facebook: 'https://www.facebook.com/share/1ADo3TXZUU/' as string | null,
}

/** The client's Instagram posts with client stories, newest first (share tracking parameters removed). */
export const INSTAGRAM_POSTS = ['DeKPhEvsQZF', 'DdZRh_0m3Os', 'DcwNzpVoDDM', 'Db6EN-EgPss', 'Da3GXLaDLey', 'DahgS8aj5nL', 'DaArdHwD-by', 'DZcA8iOsBsU', 'DUlnu-AjNDm'].map(
  (id) => `https://www.instagram.com/p/${id}/`,
)

/** Client material still missing is shown as a marked placeholder unless this is turned off. */
export const SHOW_PENDING = process.env.NEXT_PUBLIC_SHOW_PENDING !== '0'
