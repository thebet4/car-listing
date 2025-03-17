interface UploadCarListResponse {
    statusCode: number,
    message: string,
    file?: string //base64
}

export async function UploadCarList(file: string): Promise<UploadCarListResponse> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/car/upload`,{
        method: 'POST',
        body: file
    })
    const data = await response.json()
    return data
}