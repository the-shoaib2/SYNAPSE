import styled, { keyframes } from "styled-components";

const bounce = keyframes`
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-6px);
  }
`;

const BouncingDots = styled.div<{ loading: 0 | 1 }>`
  display: ${(props) => (props.loading ? "flex" : "none")};
  justify-content: flex-start;
  align-items: center;
  gap: 2px;
  padding: 4px 0;
  width: 100%;
`;

const Dot = styled.div<{ delay: number }>`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: currentColor;
  animation: ${bounce} 1.4s ease-in-out infinite both;
  animation-delay: ${(props) => props.delay}s;
`;

export { BouncingDots, Dot };
