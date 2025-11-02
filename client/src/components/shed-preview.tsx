import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";
import { ShedConfiguration } from "@shared/schema";

interface ShedPreviewProps {
  design: ShedConfiguration;
}

export function ShedPreview({ design }: ShedPreviewProps) {
  // Get display colors based on siding selection
  const getSidingColor = () => {
    if (design.siding?.includes("Cedar")) return "#8B4513";
    if (design.siding?.includes("Vinyl")) return "#E8E8E8";
    return "#D2B48C"; // Smart Panel T1-11 default
  };

  const getRoofColor = () => {
    if (design.roof?.includes("Metal")) return "#708090";
    return "#2C2C2C"; // Asphalt shingles default
  };

  return (
    <Card data-testid="card-shed-preview">
      <CardHeader>
        <CardTitle>Your Shed Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-[4/3] rounded-lg bg-gradient-to-b from-accent/40 to-accent/10 flex items-center justify-center overflow-hidden">
          {/* Background Scene */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-100/20 to-green-100/20" />
          
          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-green-200/30 to-transparent" />

          {/* Shed Visualization */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* Roof */}
            {design.style && (
              <div
                className="relative transition-all duration-500"
                style={{
                  width: design.size?.includes("8x10") ? "140px" : 
                         design.size?.includes("10x12") ? "160px" :
                         design.size?.includes("12x16") ? "180px" : "200px",
                }}
              >
                {/* Roof shape based on style */}
                {design.style === "A-Frame" && (
                  <div
                    className="w-0 h-0 mx-auto transition-colors duration-500"
                    style={{
                      borderLeft: "70px solid transparent",
                      borderRight: "70px solid transparent",
                      borderBottom: `60px solid ${getRoofColor()}`,
                    }}
                  />
                )}
                {design.style === "Lofted Barn" && (
                  <div className="relative">
                    <div
                      className="w-0 h-0 mx-auto transition-colors duration-500"
                      style={{
                        borderLeft: "70px solid transparent",
                        borderRight: "70px solid transparent",
                        borderBottom: `40px solid ${getRoofColor()}`,
                      }}
                    />
                    <div
                      className="absolute top-8 left-1/2 -translate-x-1/2 transition-colors duration-500"
                      style={{
                        width: "80px",
                        height: "20px",
                        backgroundColor: getRoofColor(),
                      }}
                    />
                  </div>
                )}
                {(design.style === "Modern Saltbox" || design.style === "Quaker") && (
                  <div
                    className="w-0 h-0 mx-auto transition-colors duration-500"
                    style={{
                      borderLeft: "70px solid transparent",
                      borderRight: "70px solid transparent",
                      borderBottom: `50px solid ${getRoofColor()}`,
                    }}
                  />
                )}
              </div>
            )}

            {/* Walls */}
            {design.siding && (
              <div
                className="relative transition-all duration-500 border-2 border-foreground/10"
                style={{
                  width: design.size?.includes("8x10") ? "140px" : 
                         design.size?.includes("10x12") ? "160px" :
                         design.size?.includes("12x16") ? "180px" : "200px",
                  height: design.size?.includes("8x10") ? "100px" : 
                          design.size?.includes("10x12") ? "110px" :
                          design.size?.includes("12x16") ? "120px" : "130px",
                  backgroundColor: getSidingColor(),
                }}
              >
                {/* Door */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-foreground/70 border-2 border-foreground/30"
                  style={{
                    width: "30px",
                    height: "50px",
                  }}
                />

                {/* Windows */}
                {design.addons.some((a) => a.includes("Windows")) && (
                  <>
                    <div
                      className="absolute top-4 left-4 bg-blue-200/60 border-2 border-foreground/30"
                      style={{ width: "20px", height: "20px" }}
                    />
                    <div
                      className="absolute top-4 right-4 bg-blue-200/60 border-2 border-foreground/30"
                      style={{ width: "20px", height: "20px" }}
                    />
                  </>
                )}

                {/* Skylight */}
                {design.addons.some((a) => a.includes("Skylights")) && design.style && (
                  <div
                    className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-200/60 border-2 border-foreground/30"
                    style={{ width: "15px", height: "15px" }}
                  />
                )}

                {/* Electrical indicator */}
                {design.addons.some((a) => a.includes("Electrical")) && (
                  <div
                    className="absolute top-2 right-2 bg-yellow-400 rounded-full"
                    style={{ width: "8px", height: "8px" }}
                    title="Electrical included"
                  />
                )}
              </div>
            )}

            {/* Placeholder when nothing selected */}
            {!design.size && !design.style && (
              <div className="flex flex-col items-center gap-4 py-12">
                <Home className="h-24 w-24 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  Start designing to see your shed preview
                </p>
              </div>
            )}
          </div>

          {/* Size Label */}
          {design.size && (
            <div className="absolute bottom-4 right-4 rounded-md bg-card/90 px-3 py-1 text-xs font-semibold backdrop-blur">
              {design.size.split(" ")[0]}
            </div>
          )}
        </div>

        {/* Design Details */}
        <div className="mt-4 space-y-2 text-sm">
          {design.style && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Style:</span>
              <span className="font-medium" data-testid="text-preview-style">{design.style}</span>
            </div>
          )}
          {design.siding && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Siding:</span>
              <span className="font-medium" data-testid="text-preview-siding">
                {design.siding.split(" ")[0]} {design.siding.split(" ")[1]}
              </span>
            </div>
          )}
          {design.roof && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Roof:</span>
              <span className="font-medium" data-testid="text-preview-roof">
                {design.roof.split(" (")[0]}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
