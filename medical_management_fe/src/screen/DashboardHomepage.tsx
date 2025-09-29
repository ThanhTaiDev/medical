import React from "react";
import { useQuery } from "@tanstack/react-query";
import { DoctorApi } from "@/api/doctor";
import { userApi } from "@/api/user/user.api";
import ReactECharts from "echarts-for-react";

function useAdminSelectedDoctor() {
  const [doctorId, setDoctorId] = React.useState<string | undefined>(undefined);
  const { data: doctorsResp } = useQuery({
    queryKey: ["admin-doctors"],
    queryFn: async () => userApi.getUsers({ role: "DOCTOR", limit: 100 }),
  });
  const doctors = doctorsResp?.data || [];
  React.useEffect(() => {
    if (!doctorId && doctors.length > 0) setDoctorId(doctors[0].id);
  }, [doctorId, doctors]);
  return { doctorId, setDoctorId, doctors };
}

function useOverviewData(doctorId?: string) {
  const enabled = !!doctorId;
  const overviewQuery = useQuery({
    queryKey: ["doctor-overview", doctorId],
    queryFn: () => DoctorApi.overview({ doctorId }),
    enabled,
  });
  const itemsQuery = useQuery({
    queryKey: ["doctor-overview-items", doctorId],
    queryFn: () => DoctorApi.overviewPrescriptionItems({ doctorId, page: 1, limit: 10 }),
    enabled,
  });
  const patientsQuery = useQuery({
    queryKey: ["doctor-overview-patients", doctorId],
    queryFn: () => DoctorApi.overviewActivePatients({ doctorId, page: 1, limit: 10 }),
    enabled,
  });
  return { overviewQuery, itemsQuery, patientsQuery };
}

function formatPercent(n: number) {
  if (!isFinite(n) || isNaN(n)) return "0%";
  return `${(n * 100).toFixed(1)}%`;
}

const DashboardHomepage: React.FC = () => {
  const { doctorId, setDoctorId, doctors } = useAdminSelectedDoctor();
  const { overviewQuery, itemsQuery, patientsQuery } = useOverviewData(doctorId);

  const loading = overviewQuery.isLoading || itemsQuery.isLoading || patientsQuery.isLoading;
  const overview = overviewQuery.data || { totalPrescriptions: 0, activePatientsCount: 0, adherenceRate: 0 };
  const items = itemsQuery.data?.items || [];
  const patients = patientsQuery.data?.items || [];

  const pieOption = {
    tooltip: { trigger: "item" },
    legend: { top: "bottom" },
    color: ["#6366F1", "#10B981"],
    series: [
      {
        name: "Tổng quan",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 6, borderColor: "#fff", borderWidth: 2, shadowBlur: 8, shadowColor: "rgba(0,0,0,0.08)" },
        label: { show: true, formatter: "{b}: {c}", color: "#334155" },
        emphasis: { label: { show: true, fontSize: 18, fontWeight: "bold" } },
        labelLine: { show: true },
        data: [
          { value: overview.totalPrescriptions || 0, name: "Đơn đã kê" },
          { value: overview.activePatientsCount || 0, name: "BN đang điều trị" },
        ],
      },
    ],
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold">Bảng Báo Cáo</h1>
          <p className="text-xs text-muted-foreground">Tổng quan hoạt động hôm nay</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Bác sĩ:</label>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={doctorId || ""}
            onChange={(e) => setDoctorId(e.target.value || undefined)}
          >
            {doctors.map((d: any) => (
              <option key={d.id} value={d.id}>{d.fullName}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-5 grid-rows-6 gap-4">
        {/* 1) Biểu đồ + KPIs */}
        <div className="col-span-3 row-span-3 p-4 rounded-lg border bg-white shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-5 w-1.5 rounded bg-indigo-500"></span>
                <h2 className="font-semibold">Tổng quan</h2>
              </div>
              <p className="text-xs text-muted-foreground">Theo bác sĩ đã chọn</p>
            </div>
            <div className="text-right">
              <div className="text-sm">Tuân thủ</div>
              <div className="text-xl font-bold text-emerald-600">{formatPercent(overview.adherenceRate || 0)}</div>
            </div>
          </div>
          <div className="h-64">
            <ReactECharts option={pieOption} style={{ height: "100%", width: "100%" }} notMerge lazyUpdate/>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="rounded border p-3 bg-gradient-to-br from-indigo-50 to-white">
              <div className="text-xs text-indigo-700">Đơn đã kê</div>
              <div className="text-2xl font-bold text-indigo-700">{overview.totalPrescriptions || 0}</div>
            </div>
            <div className="rounded border p-3 bg-gradient-to-br from-emerald-50 to-white">
              <div className="text-xs text-emerald-700">BN đang điều trị</div>
              <div className="text-2xl font-bold text-emerald-700">{overview.activePatientsCount || 0}</div>
            </div>
            <div className="rounded border p-3 bg-gradient-to-br from-amber-50 to-white">
              <div className="text-xs text-amber-700">Tỉ lệ tuân thủ</div>
              <div className="text-2xl font-bold text-amber-700">{formatPercent(overview.adherenceRate || 0)}</div>
            </div>
          </div>
        </div>

        {/* 3) Danh sách thuốc đã kê */}
        <div className="col-span-3 row-span-3 col-start-1 row-start-4 p-4 rounded-lg border bg-white shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="inline-block h-5 w-1.5 rounded bg-amber-500"></span>
              <h2 className="font-semibold">Thuốc đã kê gần đây</h2>
            </div>
            <div className="text-xs text-muted-foreground">Top 10</div>
          </div>
          <div className="space-y-2 max-h-64 overflow-auto pr-1">
            {loading && items.length === 0 ? (
              <div className="text-sm text-muted-foreground">Đang tải...</div>
            ) : items.length === 0 ? (
              <div className="text-sm text-muted-foreground">Chưa có dữ liệu</div>
            ) : (
              items.map((it: any) => (
                <div key={`${it.prescriptionId}-${it.medicationId}`} className="rounded border p-3 hover:bg-amber-50/40 transition-colors">
                  <div className="flex justify-between">
                    <div className="font-medium text-amber-700">{it.medicationName} {it.strength} ({it.form})</div>
                    <div className="text-xs text-muted-foreground">{it.dosage}</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Patient: {it.patientName} • Doctor: {it.doctorName}
                  </div>
                  <div className="text-xs mt-1">
                    SL lịch: <span className="font-medium text-amber-700">{it.totalDoses}</span> • Tần suất: {it.frequencyPerDay}/ngày • Số ngày: {it.durationDays}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4) Danh sách bệnh nhân + tuân thủ */}
        <div className="col-span-2 row-span-6 col-start-4 row-start-1 p-4 rounded-lg border bg-white shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="inline-block h-5 w-1.5 rounded bg-emerald-500"></span>
              <h2 className="font-semibold">Bệnh nhân đang điều trị</h2>
            </div>
            <div className="text-xs text-muted-foreground">Top 10</div>
          </div>
          <div className="space-y-2 max-h-[680px] overflow-auto pr-1">
            {loading && patients.length === 0 ? (
              <div className="text-sm text-muted-foreground">Đang tải...</div>
            ) : patients.length === 0 ? (
              <div className="text-sm text-muted-foreground">Chưa có dữ liệu</div>
            ) : (
              patients.map((p: any) => (
                <div key={p.patientId} className="rounded border p-3 hover:bg-emerald-50/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-emerald-700">{p.patientName}</div>
                      <div className="text-xs text-muted-foreground">{p.phoneNumber}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Tuân thủ</div>
                      <div className="text-lg font-semibold text-emerald-700">{formatPercent(p.adherence?.rate || 0)}</div>
                    </div>
                  </div>
                  <div className="text-xs mt-1">
                    Đã uống: <span className="font-medium text-emerald-700">{p.adherence?.taken || 0}</span> / Lịch: <span className="font-medium text-emerald-700">{p.adherence?.scheduled || 0}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Doctor: {p.doctorName}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomepage;
