import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Search, Edit, Trash2, AlertTriangle, CheckCircle, XCircle, FileText, Stethoscope } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { majorApi, MajorDoctor } from "@/api/major/major.api";
import { createMajorSchema, updateMajorSchema, CreateMajorFormData, UpdateMajorFormData } from "@/schemas/major.schema";
import toast from "react-hot-toast";

const MajorManagement: React.FC = () => {
  const queryClient = useQueryClient();
  
  // State cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // State cho dialog
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState<MajorDoctor | null>(null);

  // State cho form
  const [createForm, setCreateForm] = useState<CreateMajorFormData>({
    code: "",
    name: "",
    nameEn: "",
    description: "",
    isActive: true,
    sortOrder: 0,
  });

  const [editForm, setEditForm] = useState<UpdateMajorFormData>({
    id: "",
    code: "",
    name: "",
    nameEn: "",
    description: "",
    isActive: true,
    sortOrder: 0,
  });

  // State cho validation errors
  const [createErrors, setCreateErrors] = useState<Record<string, string>>({});
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  // Query để lấy danh sách chuyên khoa (không filter)
  const { data: majorsData, isLoading, error, refetch } = useQuery({
    queryKey: ['major-doctors'],
    queryFn: () => majorApi.getMajors({
      page: 1,
      limit: 100, // Lấy tất cả để filter trên frontend
    }),
  });

  // Mutation để tạo chuyên khoa
  const createMajorMutation = useMutation({
    mutationFn: majorApi.createMajor,
    onSuccess: () => {
      toast.success("Tạo chuyên khoa thành công!");
      queryClient.invalidateQueries({ queryKey: ['major-doctors'] });
      setOpenCreateDialog(false);
      resetCreateForm();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo chuyên khoa");
    },
  });

  // Mutation để cập nhật chuyên khoa
  const updateMajorMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UpdateMajorFormData> }) => 
      majorApi.updateMajor(id, data),
    onSuccess: () => {
      toast.success("Cập nhật chuyên khoa thành công!");
      queryClient.invalidateQueries({ queryKey: ['major-doctors'] });
      setOpenEditDialog(false);
      resetEditForm();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật chuyên khoa");
    },
  });

  // Mutation để xóa chuyên khoa
  const deleteMajorMutation = useMutation({
    mutationFn: majorApi.deleteMajor,
    onSuccess: () => {
      toast.success("Xóa chuyên khoa thành công!");
      queryClient.invalidateQueries({ queryKey: ['major-doctors'] });
      setOpenDeleteDialog(false);
      setSelectedMajor(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa chuyên khoa");
    },
  });

  // Mutation để cập nhật trạng thái
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      majorApi.updateMajorStatus(id, isActive),
    onSuccess: () => {
      toast.success("Cập nhật trạng thái thành công!");
      queryClient.invalidateQueries({ queryKey: ['major-doctors'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật trạng thái");
    },
  });

  // Helper functions
  const resetCreateForm = () => {
    setCreateForm({
      code: "",
      name: "",
      nameEn: "",
      description: "",
      isActive: true,
      sortOrder: 0,
    });
    setCreateErrors({});
  };

  const resetEditForm = () => {
    setEditForm({
      id: "",
      code: "",
      name: "",
      nameEn: "",
      description: "",
      isActive: true,
      sortOrder: 0,
    });
    setEditErrors({});
  };

  // Validation functions
  const validateCreateForm = (): boolean => {
    try {
      createMajorSchema.parse(createForm);
      setCreateErrors({});
      return true;
    } catch (error: any) {
      const errors: Record<string, string> = {};
      error.errors?.forEach((err: any) => {
        errors[err.path[0]] = err.message;
      });
      setCreateErrors(errors);
      return false;
    }
  };

  const validateEditForm = (): boolean => {
    try {
      updateMajorSchema.parse(editForm);
      setEditErrors({});
      return true;
    } catch (error: any) {
      const errors: Record<string, string> = {};
      error.errors?.forEach((err: any) => {
        errors[err.path[0]] = err.message;
      });
      setEditErrors(errors);
      return false;
    }
  };

  // Frontend filtering logic
  const getFilteredMajors = () => {
    if (!majorsData?.data) return [];
    
    let filtered = majorsData.data;
    
    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter((major: MajorDoctor) =>
        major.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        major.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (major.nameEn && major.nameEn.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by status
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filtered = filtered.filter((major: MajorDoctor) => major.isActive === isActive);
    }
    
    return filtered;
  };


  // Xử lý mở dialog tạo mới
  const handleOpenCreateDialog = () => {
    resetCreateForm();
    setOpenCreateDialog(true);
  };

  // Xử lý mở dialog chỉnh sửa
  const handleOpenEditDialog = (major: MajorDoctor) => {
    setEditForm({
      id: major.id,
      code: major.code,
      name: major.name,
      nameEn: major.nameEn || "",
      description: major.description || "",
      isActive: major.isActive,
      sortOrder: major.sortOrder,
    });
    setEditErrors({});
    setOpenEditDialog(true);
  };

  // Xử lý mở dialog xóa
  const handleOpenDeleteDialog = (major: MajorDoctor) => {
    setSelectedMajor(major);
    setOpenDeleteDialog(true);
  };

  // Xử lý tạo chuyên khoa
  const handleCreateMajor = () => {
    if (!validateCreateForm()) return;
    createMajorMutation.mutate(createForm);
  };

  // Xử lý cập nhật chuyên khoa
  const handleUpdateMajor = () => {
    if (!validateEditForm()) return;
    const { id, ...updateData } = editForm;
    updateMajorMutation.mutate({ id, data: updateData });
  };

  // Xử lý xóa chuyên khoa
  const handleDeleteMajor = () => {
    if (!selectedMajor) return;
    deleteMajorMutation.mutate(selectedMajor.id);
  };

  // Xử lý cập nhật trạng thái
  const handleToggleStatus = (id: string, currentStatus: boolean, name: string) => {
    const action = currentStatus ? "tạm dừng" : "kích hoạt";
    if (window.confirm(`Bạn có chắc chắn muốn ${action} chuyên khoa "${name}"?`)) {
      updateStatusMutation.mutate({ id, isActive: !currentStatus });
    }
  };

  // Lấy dữ liệu đã filter và phân trang
  const filteredMajors = getFilteredMajors();
  const totalItems = filteredMajors.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  
  // Pagination logic
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const majors = filteredMajors.slice(startIndex, endIndex);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `,
        }}
      />
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý chuyên khoa</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý danh sách các chuyên khoa y tế trong hệ thống
          </p>
        </div>
        <Button 
          onClick={handleOpenCreateDialog}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm chuyên khoa
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Tổng chuyên khoa
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center">
              <span className="text-blue-700 font-bold text-sm">
                {majorsData?.data?.length || 0}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">
              {majorsData?.data?.length || 0}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Chuyên khoa đã đăng ký
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Đang hoạt động
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-200 flex items-center justify-center">
              <span className="text-green-700 font-bold text-sm">
                {filteredMajors.filter((m: MajorDoctor) => m.isActive).length}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">
              {filteredMajors.filter((m: MajorDoctor) => m.isActive).length}
            </div>
            <p className="text-xs text-green-600 mt-1">
              Chuyên khoa đang hoạt động
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              Tạm dừng
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-orange-200 flex items-center justify-center">
              <span className="text-orange-700 font-bold text-sm">
                {filteredMajors.filter((m: MajorDoctor) => !m.isActive).length}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">
              {filteredMajors.filter((m: MajorDoctor) => !m.isActive).length}
            </div>
            <p className="text-xs text-orange-600 mt-1">
              Chuyên khoa tạm dừng
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Tìm kiếm và lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Tìm kiếm</Label>
              <Input
                id="search"
                placeholder="Tìm kiếm theo tên chuyên khoa..."
                className="mt-1"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
              />
            </div>
            <div className="sm:w-48">
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={statusFilter} onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1); // Reset to first page when filtering
              }}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Đang hoạt động</SelectItem>
                  <SelectItem value="inactive">Tạm dừng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách chuyên khoa</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  <div
                    className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-primary/40 rounded-full animate-spin"
                    style={{
                      animationDelay: "0.15s",
                      animationDuration: "1.5s",
                    }}
                  ></div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium">
                    Đang tải dữ liệu...
                  </span>
                  <p className="text-xs text-muted-foreground/70">
                    Vui lòng chờ trong giây lát
                  </p>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-destructive/50 to-destructive/30 rounded-2xl flex items-center justify-center">
                    <AlertTriangle className="h-8 w-8 text-destructive/50" />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-destructive">
                    Có lỗi xảy ra khi tải dữ liệu
                  </span>
                  <p className="text-xs text-muted-foreground/70">
                    Vui lòng thử lại sau
                  </p>
                </div>
                <Button variant="outline" onClick={() => refetch()}>
                  Thử lại
                </Button>
              </div>
            </div>
          ) : filteredMajors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl flex items-center justify-center">
                    <Search className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium">
                    Không có dữ liệu
                  </span>
                  <p className="text-xs text-muted-foreground/70">
                    Chuyên khoa sẽ xuất hiện ở đây khi được thêm
                  </p>
                </div>
                <Button variant="outline" onClick={() => refetch()}>
                  Làm mới
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="relative rounded-2xl border border-border/20 overflow-hidden bg-gradient-to-br from-background/50 to-background/30 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-50"></div>
                <div className="relative">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-muted/40 via-muted/20 to-muted/40 border-b border-border/30 hover:bg-gradient-to-r hover:from-muted/60 hover:via-muted/40 hover:to-muted/60 transition-all duration-300">
                        <TableHead className="font-bold text-foreground/90 py-4">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-primary/10 rounded-lg">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            Mã chuyên khoa
                          </div>
                        </TableHead>
                        <TableHead className="font-bold text-foreground/90 py-4">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-primary/10 rounded-lg">
                              <Stethoscope className="h-4 w-4 text-primary" />
                            </div>
                            Tên chuyên khoa
                          </div>
                        </TableHead>
                        <TableHead className="font-bold text-foreground/90 py-4">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-primary/10 rounded-lg">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            Tên tiếng Anh
                          </div>
                        </TableHead>
                        <TableHead className="font-bold text-foreground/90 py-4">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-primary/10 rounded-lg">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            Mô tả
                          </div>
                        </TableHead>
                        <TableHead className="font-bold text-foreground/90 py-4">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-primary/10 rounded-lg">
                              <CheckCircle className="h-4 w-4 text-primary" />
                            </div>
                            Trạng thái
                          </div>
                        </TableHead>
                        <TableHead className="font-bold text-foreground/90 py-4">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-primary/10 rounded-lg">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            Thứ tự
                          </div>
                        </TableHead>
                        <TableHead className="text-right font-bold text-foreground/90 py-4">
                          Thao tác
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {majors.map((major: MajorDoctor, index: number) => (
                        <TableRow 
                          key={major.id}
                          className="group hover:bg-gradient-to-r hover:from-primary/5 hover:via-primary/3 hover:to-primary/5 transition-all duration-500 border-b border-border/20 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                          style={{
                            animationDelay: `${index * 100}ms`,
                            animation: "fadeInUp 0.6s ease-out forwards",
                          }}
                        >
                          <TableCell className="font-medium py-4">
                            <span className="font-mono text-sm bg-gradient-to-r from-muted/80 to-muted/60 px-3 py-1.5 rounded-lg border border-border/30 group-hover:from-primary/10 group-hover:to-primary/5 group-hover:border-primary/20 transition-all duration-300">
                              {major.code}
                            </span>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center gap-4">
                              <div className="relative group-hover:scale-110 transition-transform duration-300">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
                                <div className="relative w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                                  <span className="text-sm font-bold text-primary">
                                    {major.name?.charAt(0)?.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <span className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                                {major.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <span className="text-muted-foreground font-medium">
                              {major.nameEn || "-"}
                            </span>
                          </TableCell>
                          <TableCell className="py-4">
                            <span className="text-muted-foreground max-w-xs truncate block font-medium">
                              {major.description || "-"}
                            </span>
                          </TableCell>
                          <TableCell className="py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 group-hover:scale-105 cursor-pointer ${
                                major.isActive
                                  ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300/50 hover:from-green-200 hover:to-green-300"
                                  : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300/50 hover:from-gray-200 hover:to-gray-300"
                              }`}
                              onClick={() => handleToggleStatus(major.id, major.isActive, major.name)}
                            >
                              <div
                                className={`w-2 h-2 rounded-full mr-2 ${
                                  major.isActive ? "bg-green-600" : "bg-gray-600"
                                }`}
                              ></div>
                              {major.isActive ? "Hoạt động" : "Tạm dừng"}
                            </span>
                          </TableCell>
                          <TableCell className="py-4">
                            <span className="text-muted-foreground font-medium">
                              {major.sortOrder}
                            </span>
                          </TableCell>
                          <TableCell className="text-right py-4">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:border-primary/30 hover:text-primary hover:shadow-md hover:shadow-primary/10 transition-all duration-300 group-hover:scale-105"
                                onClick={() => handleOpenEditDialog(major)}
                                title="Chỉnh sửa"
                              >
                                <Edit className="h-4 w-4 mr-1.5" />
                                Sửa
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-gradient-to-r hover:from-destructive/10 hover:to-destructive/5 hover:border-destructive/30 hover:text-destructive hover:shadow-md hover:shadow-destructive/10 transition-all duration-300 group-hover:scale-105"
                                onClick={() => handleOpenDeleteDialog(major)}
                                disabled={deleteMajorMutation.isPending}
                                title="Xóa"
                              >
                                {deleteMajorMutation.isPending ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-destructive"></div>
                                ) : (
                                  <div className="flex items-center">
                                    <Trash2 className="h-4 w-4 mr-1.5" />
                                    Xóa
                                  </div>
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Hiển thị {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalItems)} trong tổng số {totalItems} chuyên khoa
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Trước
                    </Button>
                    <span className="text-sm">
                      Trang {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog Tạo mới chuyên khoa */}
      <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Thêm chuyên khoa mới
            </DialogTitle>
            <DialogDescription>
              Nhập thông tin để tạo chuyên khoa mới trong hệ thống
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-code">Mã chuyên khoa *</Label>
                <Input
                  id="create-code"
                  placeholder="VD: TIM_MACH"
                  value={createForm.code}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  className={createErrors.code ? "border-red-500" : ""}
                />
                {createErrors.code && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {createErrors.code}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="create-sortOrder">Thứ tự</Label>
                <Input
                  id="create-sortOrder"
                  type="number"
                  min="0"
                  max="999"
                  placeholder="0"
                  value={createForm.sortOrder}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                  className={createErrors.sortOrder ? "border-red-500" : ""}
                />
                {createErrors.sortOrder && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {createErrors.sortOrder}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-name">Tên chuyên khoa *</Label>
              <Input
                id="create-name"
                placeholder="VD: Tim mạch"
                value={createForm.name}
                onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                className={createErrors.name ? "border-red-500" : ""}
              />
              {createErrors.name && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {createErrors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-nameEn">Tên tiếng Anh</Label>
              <Input
                id="create-nameEn"
                placeholder="VD: Cardiology"
                value={createForm.nameEn}
                onChange={(e) => setCreateForm(prev => ({ ...prev, nameEn: e.target.value }))}
                className={createErrors.nameEn ? "border-red-500" : ""}
              />
              {createErrors.nameEn && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {createErrors.nameEn}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-description">Mô tả</Label>
              <Textarea
                id="create-description"
                placeholder="Mô tả chi tiết về chuyên khoa..."
                value={createForm.description}
                onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                className={createErrors.description ? "border-red-500" : ""}
                rows={3}
              />
              {createErrors.description && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {createErrors.description}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="create-isActive"
                checked={createForm.isActive}
                onCheckedChange={(checked) => setCreateForm(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="create-isActive">Kích hoạt chuyên khoa</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenCreateDialog(false)}
              disabled={createMajorMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              onClick={handleCreateMajor}
              disabled={createMajorMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createMajorMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang tạo...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Tạo chuyên khoa
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Chỉnh sửa chuyên khoa */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-blue-600" />
              Chỉnh sửa chuyên khoa
            </DialogTitle>
            <DialogDescription>
              Cập nhật thông tin chuyên khoa
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-code">Mã chuyên khoa *</Label>
                <Input
                  id="edit-code"
                  placeholder="VD: TIM_MACH"
                  value={editForm.code}
                  onChange={(e) => setEditForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  className={editErrors.code ? "border-red-500" : ""}
                />
                {editErrors.code && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {editErrors.code}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-sortOrder">Thứ tự</Label>
                <Input
                  id="edit-sortOrder"
                  type="number"
                  min="0"
                  max="999"
                  placeholder="0"
                  value={editForm.sortOrder}
                  onChange={(e) => setEditForm(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                  className={editErrors.sortOrder ? "border-red-500" : ""}
                />
                {editErrors.sortOrder && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {editErrors.sortOrder}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên chuyên khoa *</Label>
              <Input
                id="edit-name"
                placeholder="VD: Tim mạch"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                className={editErrors.name ? "border-red-500" : ""}
              />
              {editErrors.name && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {editErrors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-nameEn">Tên tiếng Anh</Label>
              <Input
                id="edit-nameEn"
                placeholder="VD: Cardiology"
                value={editForm.nameEn}
                onChange={(e) => setEditForm(prev => ({ ...prev, nameEn: e.target.value }))}
                className={editErrors.nameEn ? "border-red-500" : ""}
              />
              {editErrors.nameEn && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {editErrors.nameEn}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea
                id="edit-description"
                placeholder="Mô tả chi tiết về chuyên khoa..."
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                className={editErrors.description ? "border-red-500" : ""}
                rows={3}
              />
              {editErrors.description && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {editErrors.description}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={editForm.isActive}
                onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="edit-isActive">Kích hoạt chuyên khoa</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenEditDialog(false)}
              disabled={updateMajorMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdateMajor}
              disabled={updateMajorMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updateMajorMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Cập nhật
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Xóa chuyên khoa */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Xác nhận xóa chuyên khoa
            </DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa chuyên khoa này?
            </DialogDescription>
          </DialogHeader>
          
          {selectedMajor && (
            <div className="py-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800 font-medium">
                  <AlertTriangle className="w-4 h-4" />
                  Thông tin chuyên khoa sẽ bị xóa:
                </div>
                <div className="mt-2 space-y-1 text-sm text-red-700">
                  <p><strong>Mã:</strong> {selectedMajor.code}</p>
                  <p><strong>Tên:</strong> {selectedMajor.name}</p>
                  {selectedMajor.nameEn && (
                    <p><strong>Tên tiếng Anh:</strong> {selectedMajor.nameEn}</p>
                  )}
                  {selectedMajor._count?.doctors && selectedMajor._count.doctors > 0 && (
                    <p className="text-red-600 font-medium">
                      ⚠️ Có {selectedMajor._count.doctors} bác sĩ đang sử dụng chuyên khoa này
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
              disabled={deleteMajorMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteMajor}
              disabled={deleteMajorMutation.isPending}
            >
              {deleteMajorMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang xóa...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa chuyên khoa
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </>
  );
};

export default MajorManagement;
