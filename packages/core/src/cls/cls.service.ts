import { Injectable } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";

export interface RequestStore {
  requestId: string;
  userId?: string;
  ip?: string;
}

@Injectable()
export class ClsService {
  private readonly als = new AsyncLocalStorage<RequestStore>();

  run(store: RequestStore, callback: () => void) {
    this.als.run(store, callback);
  }

  getStore(): RequestStore | undefined {
    return this.als.getStore();
  }

  // Helper hàm lấy nhanh 1 giá trị theo key
  get<K extends keyof RequestStore>(key: K): RequestStore[K] | undefined {
    const store = this.getStore();
    return store ? store[key] : undefined;
  }

  // Cập nhật/bổ sung thông tin vào store trong suốt chuỗi xử lý (VD: sau khi AuthGuard xác thực xong)
  set<K extends keyof RequestStore>(key: K, value: RequestStore[K]): void {
    const store = this.getStore();
    if (store) {
      store[key] = value;
    }
  }
}
