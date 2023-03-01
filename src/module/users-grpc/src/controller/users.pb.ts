/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "users";

export interface FindAllRequest {
  name: string;
  username: string;
  role: string;
}

export interface FindAllResponse {
  count: number;
  data: FindOneResponse[];
}

export interface FindOneRequest {
  userId: string;
}

export interface FindOneResponse {
  id: string;
  username: string;
  role: string;
  name: string;
  age?: number | undefined;
  createAt: string;
  updateAt: string;
}

export interface CreateRequest {
  username: string;
  password: string;
  role: string;
  name: string;
  age?: number | undefined;
}

export interface UpdateRequest {
  userId: string;
  password?: string | undefined;
  role?: string | undefined;
  name?: string | undefined;
  age?: number | undefined;
}

export interface DeleteRequest {
  userId: string;
}

export interface UpdateAndDeleteResponse {
  count: number;
}

export const USERS_PACKAGE_NAME = "users";

export interface UsersServiceClient {
  findAll(request: FindAllRequest, metadata?: Metadata): Observable<FindAllResponse>;

  findOne(request: FindOneRequest, metadata?: Metadata): Observable<FindOneResponse>;

  create(request: CreateRequest, metadata?: Metadata): Observable<FindOneResponse>;

  update(request: UpdateRequest, metadata?: Metadata): Observable<UpdateAndDeleteResponse>;

  delete(request: DeleteRequest, metadata?: Metadata): Observable<UpdateAndDeleteResponse>;
}

export interface UsersServiceController {
  findAll(
    request: FindAllRequest,
    metadata?: Metadata,
  ): Promise<FindAllResponse> | Observable<FindAllResponse> | FindAllResponse;

  findOne(
    request: FindOneRequest,
    metadata?: Metadata,
  ): Promise<FindOneResponse> | Observable<FindOneResponse> | FindOneResponse;

  create(
    request: CreateRequest,
    metadata?: Metadata,
  ): Promise<FindOneResponse> | Observable<FindOneResponse> | FindOneResponse;

  update(
    request: UpdateRequest,
    metadata?: Metadata,
  ): Promise<UpdateAndDeleteResponse> | Observable<UpdateAndDeleteResponse> | UpdateAndDeleteResponse;

  delete(
    request: DeleteRequest,
    metadata?: Metadata,
  ): Promise<UpdateAndDeleteResponse> | Observable<UpdateAndDeleteResponse> | UpdateAndDeleteResponse;
}

export function UsersServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findAll", "findOne", "create", "update", "delete"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UsersService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UsersService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USERS_SERVICE_NAME = "UsersService";
