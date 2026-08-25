import type { FC } from "react";

import { formatNullableValue } from "../../utils";

export interface DetailTileProps {
  label: string;
  value: unknown;
}

const DetailTile: FC<DetailTileProps> = ({ label, value }) => (
  <div className="rounded-xl border p-3">
    <p className="text-muted-foreground text-xs font-semibold">{label}</p>
    <p className="text-foreground mt-1 font-semibold wrap-break-word">
      {formatNullableValue(value)}
    </p>
  </div>
);

export default DetailTile;
