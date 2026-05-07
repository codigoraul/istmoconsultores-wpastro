import { readdir, readFile, writeFile } from 'fs/promises';
import { join, relative } from 'path';

async function fixPaths(dir, baseDir = './dist') {
  const files = await readdir(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = join(dir, file.name);
    
    if (file.isDirectory()) {
      await fixPaths(fullPath, baseDir);
    } else if (file.name.endsWith('.html')) {
      let content = await readFile(fullPath, 'utf-8');
      
      // Calcular profundidad (cuántos niveles desde dist/)
      const relativePath = relative(baseDir, fullPath);
      const depth = relativePath.split('/').length - 1;
      const prefix = depth === 0 ? './' : '../'.repeat(depth);
      
      // Cambiar rutas absolutas a relativas (primero quitar el slash inicial)
      content = content.replace(/href="\/_astro\//g, 'href="_astro/');
      content = content.replace(/src="\/_astro\//g, 'src="_astro/');
      content = content.replace(/href="\/images\//g, 'href="images/');
      content = content.replace(/src="\/images\//g, 'src="images/');
      content = content.replace(/href="\/logo-/g, 'href="logo-');
      content = content.replace(/src="\/logo-/g, 'src="logo-');
      content = content.replace(/href="\/favicon\.png"/g, 'href="favicon.png"');
      
      // Ahora agregar el prefijo correcto según profundidad
      content = content.replace(/href="_astro\//g, `href="${prefix}_astro/`);
      content = content.replace(/src="_astro\//g, `src="${prefix}_astro/`);
      content = content.replace(/href="images\//g, `href="${prefix}images/`);
      content = content.replace(/src="images\//g, `src="${prefix}images/`);
      content = content.replace(/href="logo-/g, `href="${prefix}logo-`);
      content = content.replace(/src="logo-/g, `src="${prefix}logo-`);
      content = content.replace(/href="favicon\.png"/g, `href="${prefix}favicon.png"`);
      
      // Calcular ruta base relativa (siempre volver a la raíz de dist)
      const basePrefix = depth === 0 ? './' : '../'.repeat(depth);
      
      // Cambiar links internos - todos apuntan a la raíz relativa
      content = content.replace(/href="\/nosotros\/"/g, `href="${basePrefix}nosotros/"`);
      content = content.replace(/href="\/servicios\/"/g, `href="${basePrefix}servicios/"`);
      content = content.replace(/href="\/equipo\/"/g, `href="${basePrefix}equipo/"`);
      content = content.replace(/href="\/noticias\/"/g, `href="${basePrefix}noticias/"`);
      content = content.replace(/href="\/sectores\/"/g, `href="${basePrefix}sectores/"`);
      content = content.replace(/href="\/contacto\/"/g, `href="${basePrefix}contacto/"`);
      content = content.replace(/href="\/contacto"/g, `href="${basePrefix}contacto/"`);
      
      // Links dinámicos de noticias (ej: /noticias/slug-del-articulo/)
      content = content.replace(/href="\/noticias\/([^"]+)\/"/g, `href="${basePrefix}noticias/$1/"`);
      
      content = content.replace(/href="\/"/g, `href="${basePrefix}"`);
      
      // Links con anchors
      content = content.replace(/href="\/servicios#/g, `href="${basePrefix}servicios/#`);
      
      await writeFile(fullPath, content, 'utf-8');
      console.log(`✓ Fixed (depth ${depth}): ${fullPath}`);
    }
  }
}

fixPaths('./dist').then(() => {
  console.log('\n✅ All paths fixed!');
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
