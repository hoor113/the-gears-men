import { useMemo } from 'react';

type RawValueType = string;

export interface SimpleModeConfig {
  id?: React.Key;
  pId?: React.Key;
  rootPId?: React.Key;
}

export interface BaseOptionType {
  disabled?: boolean;
  children?: BaseOptionType[];
  [name: string]: any;
}

export interface DefaultOptionType extends BaseOptionType {
  value: RawValueType;
  label: React.ReactNode;
  children?: DefaultOptionType[];
}

export interface DataNode {
  value: RawValueType;
  label: React.ReactNode;
  disabled?: boolean;
  children?: DataNode[];
  /** Customize data info */
  [prop: string]: any;
}

function parseSimpleTreeData(
  treeData: DataNode[],
  { id = 'id', pId = 'pId', rootPId = undefined }: SimpleModeConfig,
): DataNode[] {
  const keyNodes: { [prop: string]: any } = {};
  const rootNodeList: DataNode[] = [];

  // Fill in the map
  const nodeList = treeData.map((node) => {
    const clone = { ...node };
    const key = clone[id as any];
    keyNodes[key] = clone;
    clone.key = clone.key || key;
    return clone;
  });

  // Connect tree
  nodeList.forEach((node) => {
    const parentKey = node[pId as any];
    const parent = keyNodes[parentKey];

    // Fill parent
    if (parent) {
      parent.children = parent.children || [];
      parent.children.push(node);
    }

    // Fill root tree node
    if (parentKey === rootPId || (!parent && rootPId === undefined)) {
      rootNodeList.push(node);
    }
  });

  return rootNodeList;
}

/**
 * Convert `treeData` or `children` into formatted `treeData`.
 * Will not re-calculate if `treeData` or `children` not change.
 */
export default function useTreeData(
  treeData: DataNode[],
  simpleMode: boolean | SimpleModeConfig,
): DefaultOptionType[] {
  return useMemo(() => {
    return simpleMode
      ? parseSimpleTreeData(treeData, {
          id: 'id',
          pId: 'pId',
          rootPId: undefined,
          ...(simpleMode !== true ? simpleMode : {}),
        })
      : treeData;
  }, [simpleMode, treeData]);
}
