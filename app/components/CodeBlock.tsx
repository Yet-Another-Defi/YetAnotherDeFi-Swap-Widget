import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  border-radius: 20px;
`;

const ScrollZone = styled.div`
  height: 400px;
  overflow: scroll;

  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(242, 242, 242, 0.5);
    border-radius: 2px;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-right: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(160, 160, 160, 0.1);
    border-radius: 2px;
  }

  ::-webkit-scrollbar-corner {
    background: transparent;
  }
`;

const CodeBracket = styled.span`
  color: #fb5400;
`;
const CodeKey = styled.span`
  color: ${(props) => props.theme.colors.orange};
`;

const CodeValue = styled.span`
  color: ${(props) => props.theme.colors.black};
`;

const CodeLevel = styled.div`
  padding-left: 1rem;
`;

const CodeLine = styled.div`
  white-space: nowrap;
`;

export function CodeBlock(): JSX.Element {
  return (
    <Container className="mt-5 rounded-2.5xl bg-white/10">
      <ScrollZone>
        <CodeBracket>&#123;</CodeBracket>
        <CodeLevel>
          <CodeLine>
            <CodeKey>"amount_out_total":</CodeKey> <CodeValue>"1498144462890979468014",</CodeValue>
          </CodeLine>
          <CodeLine>
            <CodeKey>"estimate_gas_total":</CodeKey> <CodeValue>"127000",</CodeValue>
          </CodeLine>
          <CodeLine>
            <CodeKey>"token_in":</CodeKey>{' '}
            <CodeValue> "0xdac17f958d2ee523a2206206994597c13d831ec7",</CodeValue>
          </CodeLine>
          <CodeLine>
            <CodeKey>"token_out":</CodeKey>{' '}
            <CodeValue>"0x6b175474e89094c44da98b954eedeac495271d0f",</CodeValue>
          </CodeLine>
          <CodeLine>
            <CodeKey>"gas_price":</CodeKey> <CodeValue>"16000000000",</CodeValue>
          </CodeLine>
          <CodeLine>
            <CodeKey>"fee_recipient_amount":</CodeKey> <CodeValue>"12000",</CodeValue>
          </CodeLine>
          <CodeKey>"routes":</CodeKey> <CodeBracket>[</CodeBracket>
          <CodeLevel>
            <CodeLine>
              <CodeBracket>&#123;</CodeBracket>
            </CodeLine>
            <CodeLevel>
              <CodeLine>
                <CodeKey>"protocol_name":</CodeKey> <CodeValue>"UNISWAP_V3",</CodeValue>
              </CodeLine>
              <CodeLine>
                <CodeKey>"amount_in":</CodeKey> <CodeValue>"100000000",</CodeValue>
              </CodeLine>
              <CodeLine>
                <CodeKey>"amount_out":</CodeKey> <CodeValue>"1498144462890979468014",</CodeValue>
              </CodeLine>
              <CodeLine>
                <CodeKey>"percent":</CodeKey> <CodeValue>100</CodeValue>
              </CodeLine>
              <CodeLine>
                <CodeKey>"pools":</CodeKey> <CodeBracket>[</CodeBracket>
                <CodeLevel>
                  <CodeLine>
                    <CodeBracket>&#123;</CodeBracket>
                  </CodeLine>
                  <CodeLevel>
                    <CodeLine>
                      <CodeKey>"zero_for_one":</CodeKey> <CodeValue>false,</CodeValue>
                    </CodeLine>
                    <CodeLine>
                      <CodeKey>"token0":</CodeKey>{' '}
                      <CodeValue>"0x6b175474e89094c44da98b954eedeac495271d0f",</CodeValue>
                    </CodeLine>
                    <CodeLine>
                      <CodeKey>"token1":</CodeKey>{' '}
                      <CodeValue>"0xdac17f958d2ee523a2206206994597c13d831ec7",</CodeValue>
                    </CodeLine>
                  </CodeLevel>
                  <CodeLine>
                    <CodeBracket>&#125;</CodeBracket>
                  </CodeLine>
                </CodeLevel>
                <CodeLine>
                  <CodeBracket>]</CodeBracket>
                </CodeLine>
              </CodeLine>
            </CodeLevel>
            <CodeBracket>&#125;</CodeBracket>
          </CodeLevel>
          <CodeBracket>]</CodeBracket>,
          <CodeLine>
            <CodeKey>"calldata":</CodeKey>{' '}
            <CodeValue>
              "0x318ced5d000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000005067058af992dc7d7600000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000059682f000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000018000000000000000000000006f48eca74b38d2936b02ab603ff4e36a6c0e3a77",
            </CodeValue>
          </CodeLine>
          <CodeLine>
            <CodeKey>"to":</CodeKey>
            <CodeValue>"0x1aaad07998466cd3eb8140827dddb37570be1e63"</CodeValue>
          </CodeLine>
        </CodeLevel>
        <CodeBracket>&#125;</CodeBracket>
      </ScrollZone>
    </Container>
  );
}
