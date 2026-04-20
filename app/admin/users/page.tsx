"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminAPI } from "@/lib/api/config";
import { useToast } from "@/context/toast-context";
import { LoadingSpinner } from "@/components/loading";
import { TableRowSkeleton } from "@/components/skeletons";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Shield,
  User as UserIcon,
  Ban,
  CheckCircle,
  Trash2,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  IndianRupee,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isBlocked: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  orderCount?: number;
  totalSpent?: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<User | null>(null);
  const [userDetailModal, setUserDetailModal] = useState<User | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (roleFilter !== "all") params.role = roleFilter;
      const response = (await adminAPI.getAllUsers(params)) as { users: User[] };
      setUsers(response.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      showToast("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleBlockUser = async (userId: string) => {
    try {
      setUpdating(userId);
      await adminAPI.toggleBlockUser(userId);
      showToast("User status updated", "success");
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user:", error);
      showToast("Failed to update user", "error");
    } finally {
      setUpdating(null);
    }
  };

  const toggleUserRole = async (userId: string, currentRole: string) => {
    try {
      setUpdating(userId);
      const newRole = currentRole === "admin" ? "user" : "admin";
      await adminAPI.updateUserRole(userId, newRole);
      showToast(`User role updated to ${newRole}`, "success");
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user role:", error);
      showToast("Failed to update user role", "error");
    } finally {
      setUpdating(null);
    }
  };

  const deleteUser = async () => {
    if (!deleteModal) return;
    try {
      setUpdating(deleteModal._id);
      await adminAPI.deleteUser(deleteModal._id);
      showToast("User deleted successfully", "success");
      setDeleteModal(null);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      showToast("Failed to delete user", "error");
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.phone?.includes(search)
  );

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground">
          User Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage users, roles, and permissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <UserIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-xl font-bold text-foreground">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-500/10">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-xl font-bold text-foreground">
                  {users.filter((u) => u.role === "admin").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-500/10">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-xl font-bold text-foreground">
                  {users.filter((u) => !u.isBlocked).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-500/10">
                <Ban className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Blocked</p>
                <p className="text-xl font-bold text-foreground">
                  {users.filter((u) => u.isBlocked).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email or phone..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["all", "user", "admin"].map((role) => (
                <Button
                  key={role}
                  variant={roleFilter === role ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setRoleFilter(role);
                    setPage(1);
                  }}
                  className={roleFilter === role ? "gradient-primary text-primary-foreground" : ""}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center justify-between">
            <span>All Users ({filteredUsers.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">User</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden md:table-cell">Contact</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Role</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden lg:table-cell">Stats</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRowSkeleton key={i} columns={6} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : paginatedUsers.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">User</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden md:table-cell">Contact</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Role</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden lg:table-cell">Stats</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {paginatedUsers.map((user) => (
                        <motion.tr
                          key={user._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-3 px-2">
                            <div
                              className="flex items-center gap-3 cursor-pointer"
                              onClick={() => setUserDetailModal(user)}
                            >
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-semibold">
                                  {user.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-foreground text-sm">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{formatDate(user.createdAt)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-2 hidden md:table-cell">
                            <div className="text-sm">
                              <p className="text-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" /> {user.email}
                              </p>
                              <p className="text-muted-foreground flex items-center gap-1">
                                <Phone className="h-3 w-3" /> {user.phone || "-"}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === "admin"
                                  ? "bg-purple-500/10 text-purple-600 border border-purple-500/20"
                                  : "bg-muted text-muted-foreground border border-border"
                              }`}
                            >
                              {user.role === "admin" ? (
                                <Shield className="h-3 w-3" />
                              ) : (
                                <UserIcon className="h-3 w-3" />
                              )}
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                user.isBlocked
                                  ? "bg-red-500/10 text-red-600 border border-red-500/20"
                                  : "bg-green-500/10 text-green-600 border border-green-500/20"
                              }`}
                            >
                              {user.isBlocked ? (
                                <>
                                  <Ban className="h-3 w-3" /> Blocked
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-3 w-3" /> Active
                                </>
                              )}
                            </span>
                          </td>
                          <td className="py-3 px-2 hidden lg:table-cell">
                            <div className="text-sm">
                              <p className="text-foreground flex items-center gap-1">
                                <ShoppingBag className="h-3 w-3" /> {user.orderCount || 0} orders
                              </p>
                              <p className="text-muted-foreground flex items-center gap-1">
                                <IndianRupee className="h-3 w-3" /> {(user.totalSpent || 0).toLocaleString()}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" disabled={updating === user._id}>
                                  {updating === user._id ? (
                                    <LoadingSpinner size="sm" />
                                  ) : (
                                    <MoreVertical className="h-4 w-4" />
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setUserDetailModal(user)}>
                                  <UserIcon className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toggleUserRole(user._id, user.role)}>
                                  <Shield className="h-4 w-4 mr-2" />
                                  {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toggleBlockUser(user._id)}>
                                  {user.isBlocked ? (
                                    <>
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Unblock User
                                    </>
                                  ) : (
                                    <>
                                      <Ban className="h-4 w-4 mr-2" />
                                      Block User
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => setDeleteModal(user)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Showing {(page - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(page * itemsPerPage, filteredUsers.length)} of {filteredUsers.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          size="icon"
                          onClick={() => setPage(pageNum)}
                          className={page === pageNum ? "gradient-primary" : ""}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <UserIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No users found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteModal} onOpenChange={() => setDeleteModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteModal?.name}</strong>? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModal(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteUser}
              disabled={updating === deleteModal?._id}
            >
              {updating === deleteModal?._id ? <LoadingSpinner size="sm" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Detail Modal */}
      <Dialog open={!!userDetailModal} onOpenChange={() => setUserDetailModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {userDetailModal && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-2xl">
                    {userDetailModal.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{userDetailModal.name}</h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        userDetailModal.role === "admin"
                          ? "bg-purple-500/10 text-purple-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {userDetailModal.role}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        userDetailModal.isBlocked
                          ? "bg-red-500/10 text-red-600"
                          : "bg-green-500/10 text-green-600"
                      }`}
                    >
                      {userDetailModal.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm text-foreground">{userDetailModal.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm text-foreground">{userDetailModal.phone || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Joined</p>
                    <p className="text-sm text-foreground">{formatDate(userDetailModal.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Orders</p>
                    <p className="text-sm text-foreground">{userDetailModal.orderCount || 0} orders</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                    <p className="text-sm text-foreground">
                      ₹{(userDetailModal.totalSpent || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => toggleUserRole(userDetailModal._id, userDetailModal.role)}
                >
                  {userDetailModal.role === "admin" ? "Remove Admin" : "Make Admin"}
                </Button>
                <Button
                  variant={userDetailModal.isBlocked ? "default" : "destructive"}
                  className="flex-1"
                  onClick={() => toggleBlockUser(userDetailModal._id)}
                >
                  {userDetailModal.isBlocked ? "Unblock" : "Block"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
