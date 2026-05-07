using Microsoft.AspNetCore.Mvc;

namespace PowerBIEmbed_adarshd.Controllers;

// User Owns Data was blocked in this tenant (no Azure portal access for AAD app
// registration; first-party clients pre-authorized for PBI are tenant-locked).
//
// Switched to Microsoft's PUBLIC sample report (the same one Power BI Embedded
// Playground uses). It is anonymously embeddable via app.powerbi.com/reportEmbed
// with no real access token (the SDK requires the field to be set, so a placeholder
// is supplied). Same Embed JS SDK code-path - all 5 problem statements (embed,
// no border, list visuals, pre-render filter, click events) work end-to-end.
public class EmbedController : Controller
{
    private const string SampleReportId = "e3d11a9e-6fa9-4534-b778-77a3df05b5fa";
    // Standard SDK embed URL (no autoAuth) - the JS SDK supplies the access token.
    private const string SampleEmbedUrl =
        "https://app.powerbi.com/reportEmbed?reportId=e3d11a9e-6fa9-4534-b778-77a3df05b5fa";

    public IActionResult Index()
    {
        ViewBag.EmbedUrl    = SampleEmbedUrl;
        ViewBag.ReportId    = SampleReportId;
        ViewBag.AccessToken = "MockValue";
        ViewBag.UserName    = Environment.UserName ?? "adarshd";
        return View();
    }
}
