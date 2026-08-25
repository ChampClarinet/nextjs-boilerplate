import type { FC } from "react";

import { formatNullableValue } from "../../utils";
import type { DetailTileProps } from "./detail.tile";

const SummaryTile: FC<DetailTileProps> = ({ label, value }) => (
  <div className="bg-card rounded-xl border p-4">
    <p className="text-muted-foreground text-sm font-medium">{label}</p>
    <p className="text-card-foreground mt-2 text-2xl font-bold wrap-break-word">
      {formatNullableValue(value)}
    </p>
  </div>
);

export default SummaryTile;
