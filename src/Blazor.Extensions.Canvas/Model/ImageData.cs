using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Blazor.Extensions.Canvas.Model
{
    public class ImageData
    {
        //public byte[] Data { get; set; }
        //RGBA 
        public IEnumerable<byte> Data { get; set; } 
        public double Width { get; set; }
        public double Height { get; set; }


    }
}
