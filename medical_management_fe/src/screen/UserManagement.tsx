import React, { useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { userApi } from "@/api/user/user.api";
import { User, UserListResponse } from "@/api/user/types";

const UserManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [roleFilter, setRoleFilter] = useState<"ALL" | "ADMIN" | "DOCTOR" | "PATIENT">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, isError, refetch } = useQuery<UserListResponse>({
    queryKey: ["users", page, limit, roleFilter, debouncedSearchQuery],
    queryFn: () => {
      const params = { 
        page, 
        limit, 
        role: roleFilter === "ALL" ? undefined : roleFilter,
        search: debouncedSearchQuery.trim() || undefined
      };
      console.log('🔍 Search params:', params);
      return userApi.getUsers(params);
    },
    placeholderData: keepPreviousData,
  });

  const { data: userDetail, isLoading: isLoadingDetail, isError: isErrorDetail } = useQuery<User | null>({
    queryKey: ["admin-user", selectedUserId],
    queryFn: () => (selectedUserId ? userApi.getUserById(selectedUserId) : Promise.resolve(null)),
    enabled: !!selectedUserId,
  });

  useEffect(() => {
    refetch();
  }, [page, limit, roleFilter, debouncedSearchQuery, refetch]);

  const users = data?.data ?? [];
  const pagination = data?.pagination;

  const roleLabel = (role?: User["role"]) =>
    role === "ADMIN" ? "Quản trị" : role === "DOCTOR" ? "Bác sĩ" : "Bệnh nhân";

  const roleColor = (role?: User["role"]) =>
    role === "ADMIN"
      ? "bg-purple-100 text-purple-700"
      : role === "DOCTOR"
      ? "bg-blue-100 text-blue-700"
      : "bg-emerald-100 text-emerald-700";


  const cardColorByRole = (role?: User["role"]) =>
    role === "ADMIN"
      ? "border-purple-200/70 bg-purple-50/40 hover:shadow-purple-100"
      : role === "DOCTOR"
      ? "border-blue-200/70 bg-blue-50/40 hover:shadow-blue-100"
      : "border-emerald-200/70 bg-emerald-50/40 hover:shadow-emerald-100";

  return (
    <div className="h-full bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-card rounded-2xl shadow-lg ring-1 ring-border/40 p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Quản lý người dùng</h1>
                <p className="text-sm text-muted-foreground">Xem nhanh và quản trị tài khoản hệ thống.</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="inline-flex rounded-full border border-border/40 bg-background/60 backdrop-blur px-1 py-1">
                  {(["ALL", "ADMIN", "DOCTOR", "PATIENT"] as const).map((r) => (
                    <button
                      key={r}
                      className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                        roleFilter === r
                          ? "bg-primary/10 text-primary shadow-inner"
                          : "text-muted-foreground hover:bg-accent/50"
                      }`}
                      onClick={() => {
                        setPage(1);
                        setRoleFilter(r);
                      }}
                    >
                      {r === "ALL" ? "Tất cả" : r === "ADMIN" ? "Quản trị" : r === "DOCTOR" ? "Bác sĩ" : "Bệnh nhân"}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Hiển thị</span>
                  <select
                    className="px-2 py-1.5 rounded-lg border border-border/40 bg-background text-sm hover:bg-accent/40"
                    value={limit}
                    onChange={(e) => {
                      setPage(1);
                      setLimit(parseInt(e.target.value));
                    }}
                  >
                    {[12, 16, 24].map((n) => (
                      <option key={n} value={n}>{n}/trang</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-background border border-border/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-colors"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setDebouncedSearchQuery(searchQuery);
                    }
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setDebouncedSearchQuery("");
                      setPage(1);
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setDebouncedSearchQuery(searchQuery);
                  setPage(1);
                }}
                className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                Tìm kiếm
              </button>
              {debouncedSearchQuery && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Tìm kiếm: </span>
                  <span className="font-medium text-foreground">"{debouncedSearchQuery}"</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {pagination?.total || 0} kết quả
                  </span>
                </div>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground">Đang tải...</div>
          ) : isError ? (
            <div className="flex items-center justify-center h-48 text-red-500">Không thể tải danh sách người dùng</div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {debouncedSearchQuery ? "Không tìm thấy kết quả" : "Chưa có người dùng nào"}
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {debouncedSearchQuery 
                  ? `Không tìm thấy người dùng nào với từ khóa "${debouncedSearchQuery}". Thử tìm kiếm với từ khóa khác.`
                  : "Chưa có người dùng nào trong hệ thống. Hãy thêm người dùng mới."
                }
              </p>
              {debouncedSearchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setDebouncedSearchQuery("");
                    setPage(1);
                  }}
                  className="mt-4 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Xóa bộ lọc tìm kiếm
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {users.map((u: User) => (
                  <button
                    key={u.id}
                    className={`group text-left rounded-2xl border bg-background hover:bg-card/60 shadow-sm hover:shadow-md transition-all w-full ${cardColorByRole(u.role)} focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40`}
                    onClick={() => setSelectedUserId(u.id)}
                  >
                    <div className="p-5 flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-white flex items-center justify-center text-lg font-semibold shadow-sm">
                        {u.fullName?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-base font-semibold text-foreground whitespace-normal break-words leading-snug">
                            {u.fullName}
                          </h3>
                          <span className={`shrink-0 px-2 py-0.5 rounded-md text-[11px] font-medium ${roleColor(u.role)}`}>
                            {roleLabel(u.role)}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground whitespace-normal break-words">
                          {u.phoneNumber}
                        </div>
                        <div className="flex items-center justify-end pt-2">
                          <span className="text-xs text-muted-foreground opacity-80 group-hover:opacity-100 transition-opacity">Chi tiết →</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-8">
                <div className="text-sm text-muted-foreground">
                  Trang {pagination?.currentPage} / {pagination?.totalPages} — Tổng {pagination?.total}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1.5 rounded-lg border border-border/40 hover:bg-accent/40 disabled:opacity-50"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!pagination?.hasPrevPage}
                  >
                    Trước
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-lg border border-border/40 hover:bg-accent/40 disabled:opacity-50"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!pagination?.hasNextPage}
                  >
                    Sau
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Detail Dialog */}
      {selectedUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedUserId(null)} />
          <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Thông tin người dùng</h2>
              <button 
                className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedUserId(null)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {isLoadingDetail ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <span className="ml-2 text-gray-600">Đang tải...</span>
                </div>
              ) : isErrorDetail || !userDetail ? (
                <div className="text-center py-8">
                  <p className="text-red-600">Không thể tải thông tin</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-semibold">
                      {userDetail.fullName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{userDetail.fullName}</h3>
                      <p className="text-sm text-gray-600">{userDetail.phoneNumber}</p>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="flex items-center justify-between py-2 border-t">
                    <span className="text-sm text-gray-600">Vai trò</span>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${roleColor(userDetail.role)}`}>
                      {roleLabel(userDetail.role)}
                    </span>
                  </div>

                  {/* Major */}
                  {userDetail.majorDoctor && (
                    <div className="flex items-center justify-between py-2 border-t">
                      <span className="text-sm text-gray-600">Chuyên khoa</span>
                      <span className="text-sm font-medium text-gray-900">
                        {userDetail.majorDoctor === "DINH_DUONG" ? "Dinh dưỡng" : "Tâm thần"}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end p-4 border-t">
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setSelectedUserId(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;