import { extractOpenGraphAsync } from "@devmehq/open-graph-extractor"
import { createHash } from "crypto"

export const hashUrl = (url: string) => createHash("md5").update(url).digest("hex")

const TRACKING_PARAMS = [
    // UTM parameters
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "utm_id",
    // Facebook / Meta
    "fbclid",
    "fb_action_ids",
    "fb_action_types",
    "fb_ref",
    "fb_source",
    // Google
    "gclid",
    "gclsrc",
    "dclid",
    "gbraid",
    "wbraid",
    // Microsoft
    "msclkid",
    // HubSpot
    "hsa_cam",
    "hsa_grp",
    "hsa_mt",
    "hsa_src",
    "hsa_ad",
    "hsa_acc",
    "hsa_net",
    "hsa_ver",
    "hsa_la",
    "hsa_ol",
    "hsa_kw",
    // Mailchimp
    "mc_cid",
    "mc_eid",
    // Other common trackers
    "_ga",
    "_gl",
    "_hsenc",
    "_hsmi",
    "_openstat",
    "yclid",
    "wickedid",
    "twclid",
    "ttclid",
    "igshid",
    "si",
]

export const removeTrackingParams = (url: string) => {
    const urlObj = new URL(url)
    for (const param of TRACKING_PARAMS) {
        urlObj.searchParams.delete(param)
    }
    return urlObj.toString()
}

export const getWebsiteTitle = async (url: string) => {
    const res = await fetch(url)
    const text = await res.text()
    const ogData = await extractOpenGraphAsync(text)
    return ogData.data.ogTitle
}