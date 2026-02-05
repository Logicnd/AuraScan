# AuraScan.lol email deliverability (Feb 5, 2026)

What I checked:
- DNS host: Porkbun (`curitiba.ns.porkbun.com` et al).
- Current records: no MX, SPF, DKIM, or DMARC found for `aurascan.lol` or `mail.aurascan.lol` (only SOA/A at 216.198.79.1).

Recommended sending setup (Resend + subdomain):
1) Use a dedicated subdomain to isolate reputation, e.g. `mail.aurascan.lol`.
2) In the Resend dashboard (Domains), add that subdomain. Resend will show exact DNS values for:
   - SPF: TXT at `mail.aurascan.lol` like `v=spf1 include:amazonses.com ~all` (Resend examples for Hetzner/Route53) citeturn4search0turn4search1
   - DKIM: TXT records such as `resend._domainkey.mail` with values provided in the UI (example host naming in Resend guides) citeturn4search0
   - Optional Return-Path: Resend supports custom return-path/bounce subdomains (default `send.`) to keep SPF/DMARC aligned. citeturn0search0turn4search2
3) Add DMARC at `_dmarc.mail.aurascan.lol`:
   ```
   v=DMARC1; p=quarantine; pct=20; rua=mailto:dmarc@aurascan.lol; aspf=r; adkim=s
   ```
   Use `pct` to start softly, then move to `p=reject` once reports are clean. citeturn0search1
4) One SPF record per host only; combine other senders into the same TXT if needed (SPF limit guidance). citeturn4search8
5) Warm-up: start with low-volume transactional mail (password resets, receipts) and slowly ramp to keep the new domain’s reputation healthy.

Operational notes:
- Align everything: `From`, `Return-Path`, links, and images should stay on `aurascan.lol`/`mail.aurascan.lol`.
- Use a human sender: `AuraScan Support <support@mail.aurascan.lol>` with `reply-to` set to a monitored inbox (help@aurascan.lol).
- Keep a plain-text part alongside HTML; limit links and avoid URL shorteners.
- Suppress bounces/complaints via Resend webhooks before retrying sends.

Once DNS verifies, set `RESEND_API_KEY`, `EMAIL_FROM`, and `EMAIL_REPLY_TO` in `.env.local`, restart the app, and the password-reset flow will start sending branded emails.
