"""
policy_corpus.py
────────────────
The single source of truth for the dummy HR policy corpus.

Both the PDF generator (`generate_pdfs.py`) and the chunking/ingestion pipeline can
import this so the text rendered into PDFs is identical to the text used as ground
truth in evaluation. Each entry maps a document to an ordered list of pages, where
every page has a `section` title and the realistic `text` body.

The facts encoded here are intentionally specific (numbers, durations, thresholds)
so they can support 20+ grounded Q&A scenarios.
"""

from __future__ import annotations

from typing import TypedDict


class Page(TypedDict):
    section: str
    text: str


# Effective date stamped onto every document and stored as `last_updated`.
LAST_UPDATED = "2026-01-15"

CORPUS: dict[str, list[Page]] = {
    "Employee Handbook.pdf": [
        {
            "section": "Code of Conduct",
            "text": (
                "Code of Conduct\n\n"
                "All employees of Contoso Ltd. are expected to act with integrity, honesty, "
                "and professionalism at all times. Employees must treat colleagues, customers, "
                "and partners with respect and must not engage in harassment, discrimination, or "
                "bullying of any kind. Conflicts of interest must be disclosed to a manager in "
                "writing within five business days of becoming aware of them. Accepting gifts "
                "valued at more than 50 USD from a vendor or client is prohibited and must be "
                "reported to the Ethics Office. Violations of the Code of Conduct may result in "
                "disciplinary action up to and including termination of employment. Employees who "
                "witness misconduct are required to report it through the confidential ethics "
                "hotline, and the company strictly prohibits retaliation against anyone who "
                "reports a concern in good faith."
            ),
        },
        {
            "section": "Attendance Policy",
            "text": (
                "Attendance Policy\n\n"
                "Employees are expected to be present and ready to work at their scheduled start "
                "time. If an employee is unable to report to work, they must notify their direct "
                "manager at least two hours before the scheduled start time. Three or more "
                "unexcused absences within a rolling thirty-day period will be treated as a "
                "performance issue and may trigger a formal review. Tardiness of more than fifteen "
                "minutes is recorded as a late arrival, and four late arrivals in a single month "
                "are equivalent to one unexcused absence. Planned absences must be requested "
                "through the time-off system at least three business days in advance. Repeated "
                "attendance violations are escalated to Human Resources."
            ),
        },
        {
            "section": "Remote Work Policy",
            "text": (
                "Remote Work Policy\n\n"
                "Eligible employees may work remotely up to three days per week. All remote work "
                "arrangements require manager approval in advance, and the approved schedule must "
                "be recorded in the workforce management system. Employees working remotely must "
                "be reachable during core business hours and must use the company VPN when "
                "accessing internal systems. Working remotely from a location outside the "
                "employee's country of employment is not permitted without prior written approval "
                "from Human Resources, primarily due to tax and data-residency obligations. The "
                "company does not reimburse home-office furniture but provides a one-time stipend "
                "of 200 USD for ergonomic equipment upon manager approval."
            ),
        },
        {
            "section": "Working Hours",
            "text": (
                "Working Hours\n\n"
                "The standard workweek is forty hours, typically scheduled Monday through Friday "
                "from 9:00 AM to 5:00 PM local time, including a one-hour unpaid lunch break. Core "
                "collaboration hours, during which all employees are expected to be available, are "
                "10:00 AM to 4:00 PM. Employees may request flexible start times between 7:00 AM "
                "and 10:00 AM with manager approval. Any work performed beyond forty hours in a "
                "week must be pre-approved by a manager and, where applicable, is compensated as "
                "overtime in accordance with local law. Non-exempt employees must record all hours "
                "worked in the timekeeping system."
            ),
        },
        {
            "section": "Dress Code",
            "text": (
                "Dress Code\n\n"
                "Contoso maintains a business-casual dress code in all offices. Acceptable attire "
                "includes collared shirts, blouses, slacks, and closed-toe shoes. On Fridays, and "
                "on days with no external client meetings, employees may wear neat casual clothing "
                "including clean jeans. Clothing with offensive graphics or text, athletic wear, "
                "and beachwear are not permitted in the office. Employees who meet clients on site "
                "or represent the company at external events are expected to wear business "
                "professional attire. Reasonable accommodations to the dress code for religious or "
                "medical reasons are granted upon request to Human Resources."
            ),
        },
    ],
    "Benefits and Leave Policy.pdf": [
        {
            "section": "Vacation Policy",
            "text": (
                "Vacation Policy\n\n"
                "Full-time employees accrue twenty days of paid vacation per calendar year, "
                "accruing at a rate of 1.67 days per month of service. New employees may begin "
                "using accrued vacation after completing ninety days of employment. A maximum of "
                "five unused vacation days may be carried over into the following calendar year; "
                "any balance above five days is forfeited on December 31. Vacation requests must "
                "be submitted at least two weeks in advance for absences longer than three "
                "consecutive days. Upon termination, accrued but unused vacation is paid out in "
                "the final paycheck where required by local law."
            ),
        },
        {
            "section": "Sick Leave",
            "text": (
                "Sick Leave\n\n"
                "Employees receive ten paid sick days per calendar year. Sick leave may be used "
                "for the employee's own illness or to care for an immediate family member. An "
                "absence of three or more consecutive sick days requires a medical certificate "
                "from a licensed healthcare provider, which must be submitted to Human Resources "
                "within five business days of returning to work. Unused sick days do not carry "
                "over to the next year and are not paid out upon termination. Employees who exhaust "
                "their paid sick leave may apply for unpaid medical leave or short-term disability "
                "where eligible."
            ),
        },
        {
            "section": "Parental Leave",
            "text": (
                "Parental Leave\n\n"
                "Contoso provides twelve weeks of paid parental leave to all new parents, "
                "including birth, adoption, and foster placement, taken within twelve months of "
                "the child's arrival. To be eligible, an employee must have completed at least "
                "six months of continuous service. Parental leave may be taken in up to two "
                "separate blocks with manager coordination. Employees on parental leave retain "
                "their health benefits, and the company holds the employee's position or an "
                "equivalent role for the duration of the leave. Requests should be submitted at "
                "least thirty days before the planned start date where foreseeable."
            ),
        },
        {
            "section": "Bereavement Leave",
            "text": (
                "Bereavement Leave\n\n"
                "Employees are entitled to five days of paid bereavement leave following the death "
                "of an immediate family member, defined as a spouse, domestic partner, child, "
                "parent, sibling, grandparent, or grandchild. For the death of an extended family "
                "member, employees may take up to two days of paid bereavement leave. Additional "
                "unpaid time off may be granted at the manager's discretion. The company may "
                "request supporting documentation, such as an obituary or memorial program, for "
                "leaves longer than three days."
            ),
        },
        {
            "section": "Holiday Calendar",
            "text": (
                "Holiday Calendar\n\n"
                "Contoso observes eleven paid company holidays each year: New Year's Day, Martin "
                "Luther King Jr. Day, Presidents' Day, Memorial Day, Juneteenth, Independence Day, "
                "Labor Day, Thanksgiving Day, the day after Thanksgiving, Christmas Eve, and "
                "Christmas Day. When a holiday falls on a Saturday, it is observed on the preceding "
                "Friday; when it falls on a Sunday, it is observed on the following Monday. In "
                "addition to fixed holidays, each employee receives two floating holidays per year "
                "to use for personal or religious observances, which do not carry over."
            ),
        },
    ],
    "Information Security SOP.pdf": [
        {
            "section": "Password Requirements",
            "text": (
                "Password Requirements\n\n"
                "All user account passwords must be a minimum of twelve characters and must "
                "include at least one uppercase letter, one lowercase letter, one number, and one "
                "special character. Passwords must be rotated every ninety days, and the previous "
                "five passwords may not be reused. Passwords must never be shared, written down in "
                "an unsecured location, or stored in plaintext. The company provides an approved "
                "enterprise password manager, and employees are required to use it for all "
                "work-related credentials. Accounts are automatically locked after five "
                "consecutive failed sign-in attempts and require a help-desk verification to "
                "unlock."
            ),
        },
        {
            "section": "Multi-Factor Authentication",
            "text": (
                "Multi-Factor Authentication\n\n"
                "Multi-factor authentication (MFA) is mandatory for all employees accessing "
                "company systems, including email, the VPN, and all cloud applications. The "
                "approved second factors are the company authenticator app and hardware security "
                "keys; SMS-based codes are permitted only as a temporary fallback and must be "
                "replaced within thirty days. Employees must register at least two MFA methods to "
                "ensure account recovery. Any lost or compromised MFA device must be reported to "
                "the IT Service Desk immediately so the device can be revoked. MFA prompts must "
                "never be approved unless the employee personally initiated the sign-in."
            ),
        },
        {
            "section": "Acceptable Use Policy",
            "text": (
                "Acceptable Use Policy\n\n"
                "Company devices, networks, and accounts are provided for business purposes. "
                "Limited personal use is permitted provided it does not interfere with work, "
                "consume excessive resources, or violate any policy. Employees must not install "
                "unapproved software, disable security controls, or connect unauthorized devices "
                "to the corporate network. Accessing illegal, offensive, or inappropriate content "
                "is strictly prohibited. All activity on company systems may be monitored and "
                "logged for security and compliance purposes. Confidential company information "
                "must never be sent to personal email accounts or stored on unapproved cloud "
                "services."
            ),
        },
        {
            "section": "Data Classification",
            "text": (
                "Data Classification\n\n"
                "All company information must be classified into one of four levels: Public, "
                "Internal, Confidential, and Restricted. Public data may be freely shared. "
                "Internal data is for employees only. Confidential data, such as customer records "
                "and financial reports, must be encrypted in transit and at rest and shared only "
                "on a need-to-know basis. Restricted data, such as authentication secrets and "
                "regulated personal data, requires the highest controls, including access logging "
                "and multi-party approval for export. Every document and dataset must be labeled "
                "with its classification, and when in doubt, employees must treat data as "
                "Confidential."
            ),
        },
        {
            "section": "Incident Reporting",
            "text": (
                "Incident Reporting\n\n"
                "Any suspected security incident, including phishing, malware, lost devices, or "
                "unauthorized access, must be reported to the Security Operations Center within "
                "one hour of discovery by emailing security@contoso.com or calling the 24/7 "
                "hotline. Employees must not attempt to investigate or remediate an incident "
                "themselves, as this may destroy evidence. After reporting, employees should "
                "preserve the affected device in its current state and await instructions. The "
                "Security team triages every report, and confirmed incidents are escalated to the "
                "Incident Response Team, which coordinates containment, communication, and "
                "post-incident review within seventy-two hours."
            ),
        },
    ],
}


def iter_pages():
    """Yield (document_name, page_number, section, text) for every page, 1-indexed."""
    for document_name, pages in CORPUS.items():
        for idx, page in enumerate(pages, start=1):
            yield document_name, idx, page["section"], page["text"]
