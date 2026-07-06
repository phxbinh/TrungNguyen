import { NextResponse } from 'next/server';
import MetaApi from 'metaapi.cloud-sdk';

const token = process.env.TOKEN || 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI4YTBiOWY0MDZkNTkzM2VjNGI4OGQwYTc0NjllMjg1YSIsImFjY2Vzc1J1bGVzIjpbeyJpZCI6InRyYWRpbmctYWNjb3VudC1tYW5hZ2VtZW50LWFwaSIsIm1ldGhvZHMiOlsidHJhZGluZy1hY2NvdW50LW1hbmFnZW1lbnQtYXBpOnJlc3Q6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbImFjY291bnQ6JFVTRVJfSUQkOmNlMTk4ZDJiLWFiMjQtNDZiZS05Mzk3LWJhYjA4OTdjYTRjNCJdfSx7ImlkIjoibWV0YWFwaS1yZXN0LWFwaSIsIm1ldGhvZHMiOlsibWV0YWFwaS1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiYWNjb3VudDokVVNFUl9JRCQ6Y2UxOThkMmItYWIyNC00NmJlLTkzOTctYmFiMDg5N2NhNGM0Il19LHsiaWQiOiJtZXRhYXBpLXJwYy1hcGkiLCJtZXRob2RzIjpbIm1ldGFhcGktYXBpOndzOnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIiwid3JpdGVyIl0sInJlc291cmNlcyI6WyJhY2NvdW50OiRVU0VSX0lEJDpjZTE5OGQyYi1hYjI0LTQ2YmUtOTM5Ny1iYWIwODk3Y2E0YzQiXX0seyJpZCI6Im1ldGFhcGktcmVhbC10aW1lLXN0cmVhbWluZy1hcGkiLCJtZXRob2RzIjpbIm1ldGFhcGktYXBpOndzOnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIiwid3JpdGVyIl0sInJlc291cmNlcyI6WyJhY2NvdW50OiRVU0VSX0lEJDpjZTE5OGQyYi1hYjI0LTQ2YmUtOTM5Ny1iYWIwODk3Y2E0YzQiXX0seyJpZCI6Im1ldGFzdGF0cy1hcGkiLCJtZXRob2RzIjpbIm1ldGFzdGF0cy1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciJdLCJyZXNvdXJjZXMiOlsiYWNjb3VudDokVVNFUl9JRCQ6Y2UxOThkMmItYWIyNC00NmJlLTkzOTctYmFiMDg5N2NhNGM0Il19LHsiaWQiOiJyaXNrLW1hbmFnZW1lbnQtYXBpIiwibWV0aG9kcyI6WyJyaXNrLW1hbmFnZW1lbnQtYXBpOnJlc3Q6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbImFjY291bnQ6JFVTRVJfSUQkOmNlMTk4ZDJiLWFiMjQtNDZiZS05Mzk3LWJhYjA4OTdjYTRjNCJdfSx7ImlkIjoibWV0YWFwaS1yZWFsLXRpbWUtc3RyZWFtaW5nLWFwaSIsIm1ldGhvZHMiOlsibWV0YWFwaS1hcGk6d3M6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbImFjY291bnQ6JFVTRVJfSUQkOmNlMTk4ZDJiLWFiMjQtNDZiZS05Mzk3LWJhYjA4OTdjYTRjNCJdfSx7ImlkIjoiY29weWZhY3RvcnktYXBpIiwibWV0aG9kcyI6WyJjb3B5ZmFjdG9yeS1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiYWNjb3VudDokVVNFUl9JRCQ6Y2UxOThkMmItYWIyNC00NmJlLTkzOTctYmFiMDg5N2NhNGM0Il19XSwiaWdub3JlUmF0ZUxpbWl0cyI6ZmFsc2UsInRva2VuSWQiOiIyMDIxMDIxMyIsImltcGVyc29uYXRlZCI6ZmFsc2UsInJlYWxVc2VySWQiOiI4YTBiOWY0MDZkNTkzM2VjNGI4OGQwYTc0NjllMjg1YSIsImlhdCI6MTc4MzMzMzE5NCwiZXhwIjoxNzg1OTI1MTk0fQ.ILhgUCUSdU-mvozLhdi3NQqEBfWZdQf4ByYmyrRKlUgXNaRV451CNxizFKvbDmzTZx1ykt02b0ee6zaPzL_u4hnSyZYqwB0T3sDlSOjmzSpDljIZs3qMUcJ8GwFlqzdGNPNzAIDH-OumInsBJJRD5XzmqdKFx7SqObeaseIjOdyzr_V0QH2bM3aPPwY9Pce_VA0dboh1g1Ap2t8LTYbiVPYxd9cPmo4On5W7Bfr1tr1d5jamoAor8PC3xXo97itP0MrTbicbPLOelcVgUMOgUWTvxNXopUk9CZgd5plV49Pml7QotdOQXXXfuE98G2loxs5u5bCg3UNIPG1JIEGwcsfUft-BtnqU5B9cEHW77Y7CpJUpnkhh8BN8g7KPshagNe000LCuAjFtESvWXU7p9gvm6enFBHM8adEDBHmAFBN3HFdtY5JO_gZAXWgH7gorOJ63clhBYeDzfzgiTKi7puWNhTuw0p3ebUxCpxLnh9PhwdDFnNuI1QW8CWKfp9sYdu11d2sBJSkunvP1itgOm7sHABka4rsneQlNPsKaknzTePH1AfC8ptnLog5zhjHjN6lvOYHNPD-40_V1MpJNFW9ZesWzOu95zGUmtHGgQaulqs5WmyOBsldzx8TUIJt8jIxuZuGmFCItvcMraViP-_roT_s0am-c4hay9wVJUYA';
const accountId = process.env.ACCOUNT_ID || 'ce198d2b-ab24-46be-9397-bab0897ca4c4';
const api = new MetaApi(token);

export async function GET() {
  try {
    const account = await api.metatraderAccountApi.getAccount(accountId);
    await account.waitConnected();

    const connection = account.getRPCConnection();
    await connection.connect();
    await connection.waitSynchronized();

    const accountInfo = await connection.getAccountInformation();
    const positions = await connection.getPositions();
    const serverTime = await connection.getServerTime();

    // Lấy thêm giá vàng hiện tại để hiển thị lên UI
    let xauPrice = { bid: 0, ask: 0 };
    try {
      //const price = await connection.getSymbolPrice('XAUUSD');
// Sửa dòng cũ:
//const price = await connection.getSymbolPrice('XAUUSD');

// Thành dòng mới:
const price = await connection.getSymbolPrice('XAUUSD', false);

      xauPrice = { bid: price.bid, ask: price.ask };
    } catch (e) {
      console.log('Chưa sub được giá vàng');
    }

    return NextResponse.json({
      success: true,
      data: {
        balance: accountInfo.balance,
        equity: accountInfo.equity,
        margin: accountInfo.margin,
        freeMargin: accountInfo.freeMargin,
        leverage: accountInfo.leverage,
        serverTime,
        xauPrice,
        positions: positions.map(p => ({
          id: p.id,
          symbol: p.symbol,
          type: p.type,
          volume: p.volume,
          openPrice: p.openPrice,
          currentPrice: p.currentPrice,
          profit: p.profit,
        }))
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
