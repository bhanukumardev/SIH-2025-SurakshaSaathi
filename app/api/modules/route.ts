import { NextRequest, NextResponse } from 'next/server';
import { getAllModules, getModuleById } from '../../../api/modules';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const module = getModuleById(id);
      if (!module) {
        return NextResponse.json(
          { error: 'Module not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(module);
    }

    const modules = getAllModules();
    return NextResponse.json(modules);
  } catch (error) {
    console.error('Modules API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
