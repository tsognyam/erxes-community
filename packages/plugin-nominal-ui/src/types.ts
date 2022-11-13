export interface INominal {
  _id: string;
  name?: string;
  createdAt?: Date;
  expiryDate?: Date;
  totalObjectCount?: number;
  checked?: boolean;
  typeId?: string;
  currentType?: IType;
}

export interface IType {
  _id: string;
  name: string;
}

// queries
export type NominalQueryResponse = {
  nominals: INominal[];
  refetch: () => void;
  loading: boolean;
};
export type TypeQueryResponse = {
  nominalTypes: IType[];
  refetch: () => void;
  loading: boolean;
};

// mutations
export type MutationVariables = {
  _id?: String;
  name: String;
  createdAt?: Date;
  expiryDate?: Date;
  checked?: Boolean;
  type?: string;
};
export type AddMutationResponse = {
  addMutation: (params: { variables: MutationVariables }) => Promise<any>;
};

export type EditMutationResponse = {
  editMutation: (params: { variables: MutationVariables }) => Promise<any>;
};

export type RemoveMutationResponse = {
  removeMutation: (params: { variables: { _id: string } }) => Promise<any>;
};

export type EditTypeMutationResponse = {
  typesEdit: (params: { variables: MutationVariables }) => Promise<any>;
};

export type RemoveTypeMutationResponse = {
  typesRemove: (params: { variables: { _id: string } }) => Promise<any>;
};

// export type NominalMutationVariables = {
//   type: string;
//   targetIds: string[];
//   tagIds: string[];
// };
