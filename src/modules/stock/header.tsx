import { type FC } from "react";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export interface HeaderProps {
  onActionButtonClick: () => unknown;
}
const Header: FC<HeaderProps> = ({ onActionButtonClick }) => {
  return (
    <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0">
        <h1 className="text-foreground text-xl font-bold tracking-normal lg:text-2xl">
          การจัดการสต็อก
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          จัดการสต็อกอุปกรณ์ การยืมคืน และคำสั่งซื้อ
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-3">
        <Button
          type="button"
          size="lg"
          className="h-11 gap-2 px-4 text-base"
          onClick={onActionButtonClick}
        >
          <Plus aria-hidden="true" className="size-5" />
          ทำรายการ
        </Button>
      </div>
    </section>
  );
};

export default Header;
