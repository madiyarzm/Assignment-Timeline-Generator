import "./../styles/globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata = { title: "ATG", description: "Assignment Timeline Generator" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}

