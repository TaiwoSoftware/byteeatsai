import { MapPin, Phone, Store } from "lucide-react";
import type { Vendor } from "./vendorDashboardTypes";

interface VendorDetailsCardProps {
  vendor: Vendor;
}

export const VendorDetailsCard = ({ vendor }: VendorDetailsCardProps) => {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="text-lg font-bold text-slate-950">Vendor Details</h3>
      <div className="mt-5 space-y-4 text-sm">
        <div className="flex items-start gap-3">
          <Store className="mt-0.5 h-4 w-4 text-slate-400" />
          <div>
            <p className="font-medium text-slate-900">{vendor.name}</p>
            <p className="text-slate-500">{vendor.category}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone className="mt-0.5 h-4 w-4 text-slate-400" />
          <p className="text-slate-700">{vendor.phone}</p>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
          <p className="text-slate-700">{vendor.address}</p>
        </div>
      </div>
    </section>
  );
};
