import { NextResponse } from "next/server";
import supabaseAdmin from "../../../lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, matricula, setor, refeitorio, historia, fileName, fileType, fileBase64 } =
      body;

    if (
      !nome ||
      !matricula ||
      !setor ||
      !historia ||
      !refeitorio ||
      !fileBase64 ||
      !fileName
    ) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    // preparar buffer a partir do base64
    const base64Data =
      typeof fileBase64 === "string"
        ? (fileBase64.split(",")[1] ?? fileBase64)
        : null;
    if (!base64Data)
      return NextResponse.json({ error: "Arquivo inválido" }, { status: 400 });
    const buffer = Buffer.from(base64Data, "base64");

    const timestamp = Date.now();
    const ext = fileName.split(".").pop() || "";
    const safeName = `${matricula}_${timestamp}.${ext}`;
    const filePath = `photos/${safeName}`;

    // Upload para o bucket 'photos'
    const { error: uploadError } = await supabaseAdmin.storage
      .from("photos")
      .upload(filePath, buffer, {
        contentType: fileType || "application/octet-stream",
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: uploadError.message || "Upload failed" },
        { status: 500 },
      );
    }

    const { data: urlData } = supabaseAdmin.storage
      .from("photos")
      .getPublicUrl(filePath);
    const photoUrl = urlData?.publicUrl ?? null;

    // Inserir registro na tabela participants
    const { data, error } = await supabaseAdmin.from("participants").insert([
      {
        nome,
        matricula,
        setor,
        refeitorio: refeitorio,
        historia,
        foto: photoUrl,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json(
        { error: error.message || "Insert failed" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 },
    );
  }
}
