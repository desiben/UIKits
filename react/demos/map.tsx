import { Coffee, Navigation } from "lucide-react"
import { Map, MapBase, MapChip, MapDot, MapPin, MapRoute } from "@/registry/facet/ui/map"

export default function MapDemo() {
  return (
    <div className="mx-auto flex max-w-[760px] flex-col gap-3">
      <Map
        label="Route from your location to Northwind HQ"
        overlay={
          <MapChip>
            <Navigation /> 14 min · Fastest route
          </MapChip>
        }
      >
        <MapBase />
        <MapRoute d="M150 190 C220 150 250 150 260 150 S420 148 470 160 S528 186 540 205" />
        <MapDot x={150} y={190} />
        <MapPin x={260} y={150} label="Blue Bottle Coffee" icon={<Coffee />} variant="inverse" delay={0.15}>
          <b>Blue Bottle Coffee</b>Open until 6 pm
        </MapPin>
        <MapPin x={540} y={205} label="Northwind HQ" delay={0.3} defaultOpen>
          <b>Northwind HQ</b>14 min · 3.2 mi via Market St
        </MapPin>
      </Map>
      <p className="text-xs text-muted-foreground">
        Northwind HQ · 500 Market St — 14 min (3.2 mi). Zoom with the controls, then drag to pan; click pins for details.
      </p>
    </div>
  )
}
