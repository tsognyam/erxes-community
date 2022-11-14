import { colors, dimensions } from '@erxes/ui/src/styles';
import styled from 'styled-components';
import styledTS from 'styled-components-ts';

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
  td:last-child {
    text-align: left;
  }
`;

export const MenuFooter = styled.footer`
  padding: 10px 20px;
`;

export const FilterHeader = styled.div`
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #eee;

  b {
    margin-bottom: 20px;
  }

  button {
    margin-left: 20px;
  }

  select {
    margin-right: 80px;
  }
`;

export const Filter = styled.div`
  margin-left: auto;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  width: 50%;
  > div {
    margin-left: 15px;

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

export const AdditionalInfo = styled.div`
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 20px;
`;
