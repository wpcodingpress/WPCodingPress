import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    // Find user
    const user = await prisma.user.findUnique({ where: { email } })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found', email }, { status: 404 })
    }
    
    if (!user.isActive) {
      return NextResponse.json({ error: 'User is disabled' }, { status: 403 })
    }
    
    const isValid = await bcrypt.compare(password, user.password)
    
    return NextResponse.json({
      email: user.email,
      role: user.role,
      sessionVersion: user.sessionVersion,
      passwordValid: isValid,
      name: user.name
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}