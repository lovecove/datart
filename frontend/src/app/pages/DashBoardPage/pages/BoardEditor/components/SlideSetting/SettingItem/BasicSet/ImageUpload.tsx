/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { DeleteOutlined } from '@ant-design/icons';
import { Form, Upload } from 'antd';
import { BoardContext } from 'app/pages/DashBoardPage/contexts/BoardContext';
import { convertImageUrl } from 'app/pages/DashBoardPage/utils';
import React, { useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { uploadBoardImage } from '../../../../slice/thunk';

export interface ImageUploadProps {
  filedName: string;

  value: string;
}
export const ImageUpload: React.FC<ImageUploadProps> = ({
  filedName,
  value,
}) => {
  return (
    <Wrapper>
      <Form.Item name={filedName} label="背景图片" preserve>
        <UploadDragger value={value} />
      </Form.Item>
    </Wrapper>
  );
};
export const UploadDragger: React.FC<{
  value: string;
  onChange?: any;
}> = ({ value, onChange }) => {
  const dispatch = useDispatch();
  const { boardId } = useContext(BoardContext);

  const beforeUpload = useCallback(
    async info => {
      const formData = new FormData();
      formData.append('file', info);
      await dispatch(
        uploadBoardImage({ boardId, formData: formData, resolve: onChange }),
      );
      return false;
    },
    [boardId, dispatch, onChange],
  );
  const getImageError = useCallback(() => {
    onChange('');
  }, [onChange]);
  const delImageUrl = useCallback(
    e => {
      e.stopPropagation();
      onChange('');
    },
    [onChange],
  );
  return (
    <StyleUpload
      name={'upload-image'}
      className="imageUpload"
      beforeUpload={beforeUpload}
      multiple={false}
    >
      {value ? (
        <div className="image-box">
          <img
            className="image"
            src={convertImageUrl(value)}
            alt=""
            onError={getImageError}
          />
          <DeleteOutlined className="del-button" onClick={delImageUrl} />
        </div>
      ) : (
        <Placeholder>点击上传</Placeholder>
      )}
    </StyleUpload>
  );
};
const StyleUpload = styled(Upload.Dragger)`
  .ant-upload-list {
    display: none;
  }

  .imageUpload {
    display: block;
  }

  .image-box {
    position: relative;
    width: 80%;
    margin: auto;
    overflow: hidden;
  }

  .del-button {
    position: absolute;
    top: 50%;
    left: 50%;
    display: none;
    font-size: 1.5rem;
    color: ${p => p.theme.textColorDisabled};
    transform: translate(-50%, -50%);
  }

  .image-box:hover .del-button {
    display: block;
  }

  .image {
    width: 100%;
    height: auto;
  }
`;
const Wrapper = styled.div``;

const Placeholder = styled.p`
  color: ${p => p.theme.textColorLight};
`;
