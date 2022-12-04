import { colors, dimensions } from '@erxes/ui/src/styles';
import styled from 'styled-components';
import styledTS from 'styled-components-ts';
import { Formgroup } from '@erxes/ui/src/components/form/styles';

export const RightMenuContainer = styled.div`
  position: fixed;
  z-index: 2;
  top: 122px;
  right: 22px;
  bottom: 0;
  width: 430px;
  background: ${colors.bgLight};
  white-space: normal;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 24px -6px rgba(9, 30, 66, 0.25),
    0 0 0 1px rgba(9, 30, 66, 0.08);
  padding: ${dimensions.coreSpacing}px;
  justify-content: space-between;
`;

export const FilterButton = styledTS<{ selected?: boolean }>(styled.div)`
  padding: 5px 20px;
  background: ${props =>
    props.selected ? colors.colorSecondary : colors.bgActive};
  color: ${props =>
    props.selected ? colors.colorWhite : colors.textSecondary};
  line-height: 20px;
  width: 100%;
  margin-bottom: 10px;
  position: relative;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;

  &:hover {
    background: ${props =>
      props.selected ? colors.colorPrimaryDark : colors.bgGray};
    cursor: pointer;
  }
`;

export const FilterBox = styled.div`
  overflow: auto;
  height: 100%;

  .Select {
    margin-bottom: 15px;
  }

  input {
    margin-bottom: 20px;
  }
`;

export const CustomRangeContainer = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: flex-end;

  > div {
    flex: 1;
    margin-right: 8px;

    input[type='text'] {
      border: none;
      width: 100%;
      height: 34px;
      padding: 5px 0;
      color: #444;
      border-bottom: 1px solid;
      border-color: #ddd;
      background: none;
      border-radius: 0;
      box-shadow: none;
      font-size: 13px;
    }
  }
`;

export const BarItems = styled.div`
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-left: 10px;
`;

export const StyledTr = styled.tr`
  &:hover {
    background: #f5f5f5;
  }
`;

export const MenuFooter = styled.footer`
  padding: 10px 20px;
`;

export const ButtonWrap = styled.div`
  text-align: right;
`;

export const Content = styled.div`
  padding: ${dimensions.coreSpacing}px;
`;

export const Block = styled.div`
  margin-bottom: ${dimensions.coreSpacing + dimensions.unitSpacing}px;
  padding-bottom: ${dimensions.unitSpacing}px;

  .Select {
    min-width: 300px;
  }

  h4 {
    color: ${colors.colorPrimary};
  }

  > div {
    padding: 0;
  }

  ${Formgroup} {
    width: 50%;
    padding-right: 20px;

    &:nth-child(2n) {
      padding-left: 20px;
      padding-right: 0px;
    }
  }

  input[type='text'] {
    border: none;
    width: 100%;
    height: 34px;
    padding: 5px 0;
    color: #444;
    border-bottom: 1px solid;
    border-color: #ddd;
    background: none;
    border-radius: 0;
    box-shadow: none;
    font-size: 1;
  }
`;

export const Divider = styled.div`
  margin: ${dimensions.coreSpacing}px 0;
  border-bottom: 1px dashed ${colors.borderDarker};
`;

export const FlexWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const AddRowButton = styled.div`
  display: flex;
  justify-content: space-between;
  button {
    width: fit-content;
    margin-left: auto;
  }
`;
