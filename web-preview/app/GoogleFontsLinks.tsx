import { getGoogleFontStylesheetHrefs } from "@/ui/theme/themeFonts";

const hrefs = getGoogleFontStylesheetHrefs();

export function GoogleFontsLinks() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {hrefs.map((href) => (
        <link key={href.slice(0, 120)} rel="stylesheet" href={href} />
      ))}
    </>
  );
}
