"use client";

import { useState } from "react";
import { Smartphone, Plus, Camera, DollarSign, Sparkles, MessageCircle, Phone, Shield, Zap, Award, CheckCircle2, Battery, Cpu, Monitor, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/ImageUploader";
import { cn } from "@/lib/utils";

interface PhoneProduct {
  id: string;
  brand: string;
  model: string;
  storage: string;
  condition: string;
  price: string;
  description: string;
  images: Array<{ id: string; preview: string }>;
  tier?: "economico" | "gama-media" | "premium";
  tests?: string[];
}

const BRANDS = ["Apple", "Samsung", "Xiaomi", "Google", "OnePlus", "Huawei", "Motorola", "Sony", "Otro"];
const CONDITIONS = ["Como nuevo", "Excelente", "Muy bueno", "Bueno", "Aceptable"];
const STORAGE = ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"];
const TIERS = [
  { value: "economico", label: "Económico", color: "text-emerald-400" },
  { value: "gama-media", label: "Gama Media", color: "text-amber-400" },
  { value: "premium", label: "Premium", color: "text-violet-400" },
];

const WHATSAPP_NUMBER = "541161870805";
const PHONE_NUMBER = "+54 9 11 6187-0805";

const SAMPLE_PRODUCTS: PhoneProduct[] = [
  {
    id: "sample-1",
    brand: "Apple",
    model: "iPhone 15 Pro Max",
    storage: "256GB",
    condition: "Como nuevo",
    price: "890000",
    description: "Equipo impecable, sin marcas de uso. Batería al 98%. Incluye caja original y cargador.",
    images: [{ id: "1", preview: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop" }],
    tier: "premium",
    tests: ["Batería 98%", "Face ID OK", "Pantalla perfecta", "Cámaras OK"],
  },
  {
    id: "sample-2",
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    storage: "512GB",
    condition: "Excelente",
    price: "750000",
    description: "S-Pen incluido. Mínimas marcas de uso en el marco. Funcionamiento impecable.",
    images: [{ id: "2", preview: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop" }],
    tier: "premium",
    tests: ["Batería 95%", "S-Pen OK", "Pantalla AMOLED OK", "5G activo"],
  },
  {
    id: "sample-3",
    brand: "Apple",
    model: "iPhone 13",
    storage: "128GB",
    condition: "Muy bueno",
    price: "420000",
    description: "Excelente relación precio-calidad. Batería al 87%. Sin Face ID issues.",
    images: [{ id: "3", preview: "https://images.unsplash.com/photo-1632633173522-47456de71b76?w=600&h=600&fit=crop" }],
    tier: "gama-media",
    tests: ["Batería 87%", "Face ID OK", "Altavoces OK", "Carga rápida OK"],
  },
  {
    id: "sample-4",
    brand: "Samsung",
    model: "Galaxy A54 5G",
    storage: "128GB",
    condition: "Excelente",
    price: "280000",
    description: "Pantalla Super AMOLED impecable. Batería de larga duración. Incluye funda.",
    images: [{ id: "4", preview: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop" }],
    tier: "gama-media",
    tests: ["Batería 92%", "Pantalla OK", "Cámaras OK", "5G activo"],
  },
  {
    id: "sample-5",
    brand: "Xiaomi",
    model: "Redmi Note 12",
    storage: "128GB",
    condition: "Muy bueno",
    price: "145000",
    description: "Gran rendimiento a precio accesible. Batería excelente, carga rápida 33W.",
    images: [{ id: "5", preview: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop" }],
    tier: "economico",
    tests: ["Batería 94%", "Carga 33W OK", "Pantalla OK", "GPS OK"],
  },
  {
    id: "sample-6",
    brand: "Motorola",
    model: "Moto G54",
    storage: "256GB",
    condition: "Excelente",
    price: "165000",
    description: "Android puro, actualizaciones garantizadas. Batería de 5000mAh.",
    images: [{ id: "6", preview: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&h=600&fit=crop" }],
    tier: "economico",
    tests: ["Batería 96%", "Sonido Dolby OK", "Pantalla 120Hz OK", "NFC OK"],
  },
];

export default function Home() {
  const [products, setProducts] = useState<PhoneProduct[]>(SAMPLE_PRODUCTS);
  const [showForm, setShowForm] = useState(false);
  const [currentImages, setCurrentImages] = useState<Array<{ id: string; preview: string }>>([]);
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; productId: string | null }>({ open: false, productId: null });
  const [deleteCode, setDeleteCode] = useState("");
  const [deleteError, setDeleteError] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [addCode, setAddCode] = useState("");
  const [addError, setAddError] = useState(false);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    storage: "",
    condition: "",
    price: "",
    description: "",
    tier: "" as "economico" | "gama-media" | "premium" | "",
  });

  const handleSubmit = () => {
    if (!formData.brand || !formData.model || !formData.price || currentImages.length === 0) return;

    const newProduct: PhoneProduct = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      brand: formData.brand,
      model: formData.model,
      storage: formData.storage,
      condition: formData.condition,
      price: formData.price,
      description: formData.description,
      images: currentImages,
      tier: formData.tier || undefined,
    };

    setProducts([newProduct, ...products]);
    setFormData({ brand: "", model: "", storage: "", condition: "", price: "", description: "", tier: "" });
    setCurrentImages([]);
    setShowForm(false);
  };

  const openWhatsApp = (product?: PhoneProduct) => {
    const message = product 
      ? `Hola! Me interesa el ${product.brand} ${product.model}${product.storage ? ` de ${product.storage}` : ''} que vi en Mil-Cell.`
      : "Hola! Me interesa conocer los teléfonos disponibles en Mil-Cell.";
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url } }, "*");
  };

  const deleteProduct = (productId: string) => {
    setDeleteModal({ open: true, productId });
    setDeleteCode("");
    setDeleteError(false);
  };

  const confirmDelete = () => {
    if (deleteCode === "46200997" && deleteModal.productId) {
      setProducts(products.filter(p => p.id !== deleteModal.productId));
      setDeleteModal({ open: false, productId: null });
      setDeleteCode("");
      setDeleteError(false);
    } else {
      setDeleteError(true);
    }
  };

  const handleAddClick = () => {
    setAddModal(true);
    setAddCode("");
    setAddError(false);
  };

  const confirmAdd = () => {
    if (addCode === "46200997") {
      setAddModal(false);
      setAddCode("");
      setAddError(false);
      setShowForm(true);
    } else {
      setAddError(true);
    }
  };

  const filteredProducts = selectedTier === "all" 
    ? products 
    : products.filter(p => p.tier === selectedTier);

  const getTierStyle = (tier?: string) => {
    switch (tier) {
      case "economico": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "gama-media": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "premium": return "bg-violet-500/20 text-violet-400 border-violet-500/30";
      default: return "bg-primary/20 text-primary border-primary/30";
    }
  };

  const getTierLabel = (tier?: string) => {
    switch (tier) {
      case "economico": return "Económico";
      case "gama-media": return "Gama Media";
      case "premium": return "Premium";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-background mesh-gradient">
      {addModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card mx-4 w-full max-w-sm rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>Agregar producto</h3>
            <p className="text-sm text-muted-foreground mb-4">Ingresa el código de administrador para agregar un nuevo producto.</p>
            <Input
              type="password"
              placeholder="Código de acceso"
              value={addCode}
              onChange={(e) => { setAddCode(e.target.value); setAddError(false); }}
              className={cn("h-12 rounded-xl bg-input/50 border-border/50 mb-2", addError && "border-red-500")}
            />
            {addError && <p className="text-xs text-red-500 mb-3">Código incorrecto</p>}
            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={() => setAddModal(false)} className="flex-1 rounded-xl">
                Cancelar
              </Button>
              <Button onClick={confirmAdd} className="flex-1 rounded-xl bg-primary hover:bg-primary/90">
                Continuar
              </Button>
            </div>
          </div>
        </div>
      )}
      {deleteModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card mx-4 w-full max-w-sm rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>Confirmar eliminación</h3>
            <p className="text-sm text-muted-foreground mb-4">Ingresa el código de administrador para eliminar este producto.</p>
            <Input
              type="password"
              placeholder="Código de acceso"
              value={deleteCode}
              onChange={(e) => { setDeleteCode(e.target.value); setDeleteError(false); }}
              className={cn("h-12 rounded-xl bg-input/50 border-border/50 mb-2", deleteError && "border-red-500")}
            />
            {deleteError && <p className="text-xs text-red-500 mb-3">Código incorrecto</p>}
            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={() => setDeleteModal({ open: false, productId: null })} className="flex-1 rounded-xl">
                Cancelar
              </Button>
              <Button onClick={confirmDelete} className="flex-1 rounded-xl bg-red-600 hover:bg-red-700">
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
      <header className="sticky top-0 z-50 border-b border-border/30 bg-background/60 backdrop-blur-2xl">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-primary/30 blur-lg" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80">
                <Smartphone className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <div>
              <span className="text-xl font-semibold tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>Mil-Cell</span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Premium Devices</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openWhatsApp()}
              className="gap-2 rounded-full border border-border/50 bg-card/50 px-4 hover:bg-primary/10 hover:border-primary/50 transition-all"
            >
              <MessageCircle className="h-4 w-4 text-primary" />
              <span className="hidden sm:inline">WhatsApp</span>
            </Button>
            <Button
              onClick={handleAddClick}
              className="gap-2 rounded-full px-5 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/35"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Agregar</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="animate-fade-in">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-6">
              <Zap className="h-3 w-3" />
              Calidad garantizada
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
              <span className="gradient-text">Tecnología Premium</span>
              <br />
              <span className="text-foreground">a tu alcance</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Celulares reacondicionados de alta calidad. Ahorra hasta un 50% sin sacrificar rendimiento.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 mb-12">
            {[
              { icon: Shield, title: "Garantía Total", desc: "Todos los equipos verificados y testeados" },
              { icon: Zap, title: "Envío Express", desc: "Recibe tu pedido en 24-48hs" },
              { icon: Award, title: "Mejor Precio", desc: "Hasta 50% menos que equipos nuevos" },
            ].map((item, i) => (
              <div 
                key={i} 
                className="animate-fade-in glass-card rounded-2xl p-6 text-center transition-all hover:scale-[1.02]"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className={cn(
            "overflow-hidden transition-all duration-500 ease-out",
            showForm ? "mb-10 max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="animate-fade-in glass-card rounded-3xl p-6 sm:p-8">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Syne, sans-serif' }}>Nuevo Dispositivo</h2>
                <p className="text-sm text-muted-foreground">Completa los detalles del equipo</p>
              </div>
            </div>

            <div className="space-y-6">
              <ImageUploader
                maxImages={6}
                onImagesChange={(imgs) => setCurrentImages(imgs.map((i) => ({ id: i.id, preview: i.preview })))}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-sm font-medium text-muted-foreground">
                    Marca
                  </Label>
                  <Select value={formData.brand} onValueChange={(v) => setFormData({ ...formData, brand: v })}>
                    <SelectTrigger id="brand" className="h-12 rounded-xl bg-input/50 border-border/50 focus:border-primary">
                      <SelectValue placeholder="Selecciona marca" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRANDS.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model" className="text-sm font-medium text-muted-foreground">
                    Modelo
                  </Label>
                  <Input
                    id="model"
                    placeholder="ej. iPhone 14 Pro"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="h-12 rounded-xl bg-input/50 border-border/50 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storage" className="text-sm font-medium text-muted-foreground">
                    Almacenamiento
                  </Label>
                  <Select value={formData.storage} onValueChange={(v) => setFormData({ ...formData, storage: v })}>
                    <SelectTrigger id="storage" className="h-12 rounded-xl bg-input/50 border-border/50 focus:border-primary">
                      <SelectValue placeholder="Selecciona capacidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {STORAGE.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition" className="text-sm font-medium text-muted-foreground">
                    Condición
                  </Label>
                  <Select value={formData.condition} onValueChange={(v) => setFormData({ ...formData, condition: v })}>
                    <SelectTrigger id="condition" className="h-12 rounded-xl bg-input/50 border-border/50 focus:border-primary">
                      <SelectValue placeholder="Estado del equipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDITIONS.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tier" className="text-sm font-medium text-muted-foreground">
                    Categoría
                  </Label>
                  <Select value={formData.tier} onValueChange={(v) => setFormData({ ...formData, tier: v as typeof formData.tier })}>
                    <SelectTrigger id="tier" className="h-12 rounded-xl bg-input/50 border-border/50 focus:border-primary">
                      <SelectValue placeholder="Selecciona gama" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIERS.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          <span className={t.color}>{t.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium text-muted-foreground">
                    Precio (ARS)
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      placeholder="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="h-12 rounded-xl bg-input/50 border-border/50 pl-10 focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-muted-foreground">
                  Descripción (opcional)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Incluye detalles como batería, accesorios incluidos, razón de venta..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[120px] resize-none rounded-xl bg-input/50 border-border/50 focus:border-primary"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1 h-12 rounded-xl border-border/50 hover:bg-muted/50"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.brand || !formData.model || !formData.price || currentImages.length === 0}
                  className="flex-1 h-12 gap-2 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
                >
                  <Sparkles className="h-4 w-4" />
                  Publicar
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Syne, sans-serif' }}>
                Catálogo
              </h2>
              <p className="text-sm text-muted-foreground">
                {filteredProducts.length} {filteredProducts.length === 1 ? "dispositivo disponible" : "dispositivos disponibles"}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedTier === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTier("all")}
                className={cn(
                  "rounded-full transition-all",
                  selectedTier === "all" ? "bg-primary" : "border-border/50 hover:bg-muted/50"
                )}
              >
                Todos
              </Button>
              <Button
                variant={selectedTier === "economico" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTier("economico")}
                className={cn(
                  "rounded-full transition-all",
                  selectedTier === "economico" ? "bg-emerald-600 hover:bg-emerald-700" : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                )}
              >
                Económicos
              </Button>
              <Button
                variant={selectedTier === "gama-media" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTier("gama-media")}
                className={cn(
                  "rounded-full transition-all",
                  selectedTier === "gama-media" ? "bg-amber-600 hover:bg-amber-700" : "border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                )}
              >
                Gama Media
              </Button>
              <Button
                variant={selectedTier === "premium" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTier("premium")}
                className={cn(
                  "rounded-full transition-all",
                  selectedTier === "premium" ? "bg-violet-600 hover:bg-violet-700" : "border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
                )}
              >
                Premium
              </Button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in group overflow-hidden rounded-2xl glass-card transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                  {product.images[0] && (
                    <img
                      src={product.images[0].preview}
                      alt={`${product.brand} ${product.model}`}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                  <div className="absolute left-4 top-4 flex flex-col gap-2">
                    {product.tier && (
                      <div className={cn("rounded-full px-3 py-1 text-xs font-medium border backdrop-blur-sm", getTierStyle(product.tier))}>
                        {getTierLabel(product.tier)}
                      </div>
                    )}
                    {product.condition && (
                      <div className="rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        {product.condition}
                      </div>
                    )}
                  </div>
                  {product.images.length > 1 && (
                    <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
                      <Camera className="h-3 w-3" />
                      {product.images.length}
                    </div>
                  )}
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-red-500/80 text-white opacity-0 transition-all hover:bg-red-600 group-hover:opacity-100 backdrop-blur-sm"
                    title="Marcar como vendido"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">{product.brand}</span>
                    {product.storage && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                        <span className="text-xs text-muted-foreground">{product.storage}</span>
                      </>
                    )}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>{product.model}</h3>
                  {product.description && (
                    <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
                  )}
                  {product.tests && product.tests.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {product.tests.map((test, i) => (
                        <span key={i} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          {test}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-border/30">
                    <div>
                      <span className="text-2xl font-bold gradient-text">${Number(product.price).toLocaleString('es-AR')}</span>
                      <p className="text-[10px] text-muted-foreground">ARS</p>
                    </div>
                    <Button 
                      size="sm" 
                      className="gap-1.5 rounded-full bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
                      onClick={() => openWhatsApp(product)}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Consultar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <section className="mt-20 glass-card rounded-3xl p-8 sm:p-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
              Nuestro Proceso de <span className="gradient-text">Verificación</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Cada equipo pasa por un riguroso proceso de pruebas antes de ser publicado
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Battery, title: "Batería", desc: "Verificamos la salud y ciclos de carga" },
              { icon: Monitor, title: "Pantalla", desc: "Test de táctil, colores y píxeles" },
              { icon: Cpu, title: "Hardware", desc: "Procesador, RAM y almacenamiento" },
              { icon: Camera, title: "Cámaras", desc: "Enfoque, flash y grabación de video" },
            ].map((item, i) => (
              <div key={i} className="text-center p-4">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h4 className="font-semibold mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border/30 mt-20">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80">
                <Smartphone className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-semibold" style={{ fontFamily: 'Syne, sans-serif' }}>Mil-Cell</span>
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Premium Devices</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href={`tel:${PHONE_NUMBER.replace(/\s/g, '')}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                {PHONE_NUMBER}
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openWhatsApp()}
                className="gap-2 rounded-full border-border/50 hover:border-primary/50 hover:bg-primary/10"
              >
                <MessageCircle className="h-4 w-4 text-primary" />
                WhatsApp
              </Button>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border/30 text-center">
            <p className="text-xs text-muted-foreground">
              Tecnología premium reacondicionada. Calidad garantizada para quienes buscan ahorrar.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
