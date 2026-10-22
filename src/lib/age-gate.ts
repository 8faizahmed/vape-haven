export const AGE_COOKIE = "vh_age_ok";

/** Fired on window once a visitor passes the age gate. */
export const AGE_VERIFIED_EVENT = "vh:age-verified";

/** Inlined in the root layout so returning visitors never see the gate flash. */
export const ageGateScript = `try{if(document.cookie.split("; ").indexOf("${AGE_COOKIE}=1")>-1)document.documentElement.dataset.ageVerified="true"}catch(e){}`;
