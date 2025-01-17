import {QRCodeSVG} from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

function StaticQRCode() {
  const qrCodeValue = 'https://web.facebook.com/profile.php?id=100079050875392'

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl text-center">Scan to Give Feedback</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
      <QRCodeSVG value={qrCodeValue} size={256} />
      </CardContent>
    </Card>
  )
}

export default StaticQRCode

